import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useDebounce from "../../hooks/useDebounce"
import useWindowSize from "../../hooks/useWindowSize"
import { getClansFromSearch } from "../../pages/api/search/clan"
import { gray } from "../../public/static/colors"
import { getClanBadgeFileName } from "../../utils/files"
import { getWarDecksFromLog } from "../../utils/functions"
import { getBattleLog, getPlayer, getPlayersFromSearch } from "../../utils/services"
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

  ::placeholder {
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

  :hover,
  :active {
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

const Spinner = styled(LoadingSpinner)`
  > span {
    padding-right: 0.5rem;
    background-color: green;
  }
`

export default function SpySearchBar({
  placeholder,
  isPlayerSearch,
  defaultValue,
  showLiveResults,
  setShowDecksSpinner,
  setDecks,
  setPlayer,
}) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [showSpinner, setShowSpinner] = useState(false)
  const { width } = useWindowSize()
  const resultsRef = useRef(null)
  const debouncedSearchTerm = useDebounce(search, 1200)
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
      const data = await getPlayersFromSearch(debouncedSearchTerm, 4)
      const { players } = await data.json()

      setResults(players)
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

  const handleClick = async (name, tag) => {
    setShowDecksSpinner(true)
    setSearch("")
    setResults([])

    const [log, player] = await Promise.all([getBattleLog(tag), getPlayer(tag)])
    const playerDecks = await getWarDecksFromLog(log)

    setDecks(playerDecks)
    setShowDecksSpinner(false)
    setPlayer({ name: player.name, tag: player.tag })
  }

  return (
    <Container ref={resultsRef}>
      <Row>
        <InputBar
          id={inputId}
          placeholder={placeholder}
          onChange={handleChange}
          defaultValue={defaultValue}
          value={search}
        />
        {showSpinner ? (
          <Spinner size={width <= 380 ? "1.3rem" : "1.4rem"} lineWidth={3} />
        ) : (
          <Icon />
        )}
      </Row>

      {results.length > 0 && (
        <Results>
          {results.map((item) => (
            <Item key={item.tag} onClick={() => handleClick(item.name, item.tag)}>
              {!isPlayerSearch && (
                <Badge
                  src={`/assets/badges/${getClanBadgeFileName(
                    item.badgeId,
                    item.clanWarTrophies
                  )}.png`}
                  height={30}
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
