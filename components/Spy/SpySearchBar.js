import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useDebounce from "../../hooks/useDebounce"
import useWindowSize from "../../hooks/useWindowSize"
import { getClansFromSearch } from "../../pages/api/search/clan"
import { gray } from "../../public/static/colors"
import { getClanBadgeFileName } from "../../utils/files"
import { getWarDecksFromLog, isValidCRTag } from "../../utils/functions"
import { addPlayer, getBattleLog, getClan, getPlayer, getPlayersFromSearch } from "../../utils/services"
import LoadingSpinner from "../LoadingSpinner"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const InputBar = styled.input`
  height: 100%;
  padding: 0 1rem;
  font-size: 1rem;
  color: ${gray["0"]};
  font-weight: 600;
  height: 2.5rem;
  background-color: transparent;

  &::placeholder {
    font-size: 0.8rem;
  }
`

const Icon = styled(BiSearchAlt)`
  color: ${gray["0"]};
  font-size: 1.4rem;
  padding-right: 0.5rem;

  @media (max-width: 380px) {
    font-size: 1.3rem;
  }
`

const Results = styled.div`
  position: absolute;
  top: calc(2.5rem + 1px);
  width: 100%;
  background: ${gray["50"]};
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 2;
`

const Item = styled.div`
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  display: flex;
  column-gap: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${gray["75"]};
  }
`

const Badge = styled(Image)``

const Name = styled.p`
  color: ${gray["0"]};
  font-weight: 600;
`

const Tag = styled.p`
  color: ${gray["25"]};
  font-size: 0.85rem;
  font-weight: 600;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  background-color: ${gray["50"]};
  outline: 1px solid ${gray["25"]};
  align-items: center;
  border-radius: 0.25rem;
  width: 18rem;
  justify-content: space-between;
`

const getSearchResultsFromDB = async (query) => {
  const data = await getPlayersFromSearch(query, 4)
  const { players } = await data.json()
  return players
}

export default function SpySearchBar({
  defaultValue,
  isPlayerSearch,
  placeholder,
  setDecks,
  setPlayer,
  setShowDecksSpinner,
  showLiveResults,
}) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [showSpinner, setShowSpinner] = useState(false)
  const { width } = useWindowSize()
  const resultsRef = useRef(null)
  const debouncedSearchTerm = useDebounce(search, 1000)
  const initialRender = useRef(true)
  const inputId = useId()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [resultsRef])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const updateSearchResults = async () => {
    setShowSpinner(true)

    if (!debouncedSearchTerm) {
      setResults([])
    } else if (isPlayerSearch) {
      if (isValidCRTag(debouncedSearchTerm)) {
        const player = await getPlayer(debouncedSearchTerm).catch(() => {})
        if (player) {
          const playerObj = {
            clanName: player?.clan?.name || "",
            clanTag: player?.clan?.tag || "",
            name: player.name,
            tag: player.tag,
          }
          setResults([playerObj])
        } else {
          const players = await getSearchResultsFromDB(debouncedSearchTerm)
          setResults(players)
        }
      } else {
        const players = await getSearchResultsFromDB(debouncedSearchTerm)
        setResults(players)
      }
    } else {
      const { clans } = await getClansFromSearch(debouncedSearchTerm, 4)
      setResults(clans)
    }

    setShowSpinner(false)
  }

  useEffect(() => {
    if (!initialRender.current) {
      if (showLiveResults) updateSearchResults()
    } else {
      initialRender.current = false
    }
  }, [debouncedSearchTerm])

  const handleClick = async (pTag) => {
    setShowDecksSpinner(true)
    setSearch("")
    setResults([])

    const [log, player] = await Promise.all([getBattleLog(pTag), getPlayer(pTag)])
    const playerDecks = await getWarDecksFromLog(log)

    addPlayer()

    const { name, tag } = player

    const clanName = player?.clan?.name
    let badge = "no_clan"

    if (clanName) {
      const clan = await getClan(player.clan.tag.substring(1))
      badge = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)
    }

    setDecks(playerDecks)
    setPlayer({ badge, clanName, name, tag })
    setShowDecksSpinner(false)
  }

  return (
    <Container ref={resultsRef}>
      <Row>
        <InputBar
          defaultValue={defaultValue}
          id={inputId}
          onChange={handleChange}
          placeholder={placeholder}
          value={search}
        />
        {showSpinner ? (
          <LoadingSpinner lineWidth={3} margin="0 0.5rem 0 0" size={width <= 380 ? "1.3rem" : "1.4rem"} />
        ) : (
          <Icon />
        )}
      </Row>

      {results.length > 0 && (
        <Results>
          {results.map((item) => (
            <Item key={item.tag} onClick={() => handleClick(item.tag)}>
              {!isPlayerSearch && (
                <Badge
                  height={30}
                  src={`/assets/badges/${getClanBadgeFileName(item.badgeId, item.clanWarTrophies)}.png`}
                  width={23}
                />
              )}
              <Column>
                <Name>{item.name}</Name>
                <Tag>{isPlayerSearch ? item.clanName : item.tag}</Tag>
              </Column>
            </Item>
          ))}
        </Results>
      )}
    </Container>
  )
}
