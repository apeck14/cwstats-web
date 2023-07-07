import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useId, useRef, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useDebounce from "../../hooks/useDebounce"
import useWindowSize from "../../hooks/useWindowSize"
import { getClansFromSearch } from "../../pages/api/search/clan"
import { gray, orange, pink } from "../../public/static/colors"
import { getClanBadgeFileName } from "../../utils/files"
import { handleCRError } from "../../utils/functions"
import { getClan, getPlayer, getPlayersFromSearch } from "../../utils/services"
import LoadingSpinner from "../LoadingSpinner"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const Main = styled.div`
  display: flex;
  align-items: center;
  height: 2.75rem;
`

const InputBar = styled.input`
  height: 100%;
  padding: 0 1.5rem;
  font-size: 1rem;
  border-radius: 1.5rem 0 0 1.5rem;
  color: ${gray["50"]};
  font-weight: 700;

  ::placeholder {
    font-size: 0.8rem;
  }
`

const Submit = styled.button`
  height: 100%;
  background-color: ${pink};
  padding: 0 1.5rem;
  border-radius: 0 1.5rem 1.5rem 0;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }

  @media (max-width: 380px) {
    padding: 0 1.25rem;
  }
`

const Icon = styled(BiSearchAlt)`
  color: ${gray["0"]};
  font-size: 1.4rem;

  @media (max-width: 380px) {
    font-size: 1.3rem;
  }
`

const Results = styled.div`
  position: absolute;
  top: 2.75rem;
  width: 80%;
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

export default function SearchBar({
  placeholder,
  isPlayerSearch,
  defaultValue,
  showLiveResults,
}) {
  const router = useRouter()
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

  const handleSubmit = (onEnterKeyValue) => {
    const trimmedSearch = onEnterKeyValue ? onEnterKeyValue.trim() : search.trim()

    if (!trimmedSearch || (defaultValue && defaultValue === trimmedSearch)) return

    setShowSpinner(true)

    const tagRegex = /^[A-Za-z0-9#]+$/
    const meetsTagReq =
      trimmedSearch.length >= 5 &&
      trimmedSearch.length <= 10 &&
      trimmedSearch.match(tagRegex)

    if (isPlayerSearch) {
      if (meetsTagReq) {
        getPlayer(trimmedSearch)
          .then((data) => router.push(`/player/${data.tag.substring(1)}`))
          .catch((err) => {
            if (err.status === 404) {
              router.push(`/player/search?q=${trimmedSearch}`)
            } else handleCRError(err, router)
          })
      } else {
        router.push(`/player/search?q=${trimmedSearch}`)
      }
      return
    }

    if (meetsTagReq) {
      getClan(trimmedSearch)
        .then((data) => router.push(`/clan/${data.tag.substring(1)}`))
        .catch((err) => {
          if (err.status === 404) {
            router.push(`/clan/search?q=${trimmedSearch}`)
          } else handleCRError(err, router)
        })
    } else {
      router.push(`/clan/search?q=${trimmedSearch}`)
    }
  }

  // on Enter key press
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault()

        const input = document.getElementById(inputId)
        handleSubmit(input.value)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [])

  const handleClick = (tag) =>
    router.push(`/${isPlayerSearch ? "player" : "clan"}/${tag.substring(1)}`)

  return (
    <Container ref={resultsRef}>
      <Main>
        <InputBar
          id={inputId}
          placeholder={placeholder}
          onChange={handleChange}
          defaultValue={defaultValue}
        />
        <Submit
          onClick={handleSubmit}
          aria-label={`${isPlayerSearch ? "Player" : "Clan"} Search`}
        >
          {showSpinner ? (
            <LoadingSpinner size={width <= 380 ? "1.3rem" : "1.4rem"} lineWidth={3} />
          ) : (
            <Icon />
          )}
        </Submit>
      </Main>
      {results.length > 0 && (
        <Results>
          {results.map((item) => (
            <Item key={item.tag} onClick={() => handleClick(item.tag)}>
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
