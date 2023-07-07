import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import { gray, orange } from "../../public/static/colors"
import { getClan, getPlayer } from "../../utils/services"

const Main = styled.div`
  background-color: ${gray["50"]};
  border-top: 2px solid ${orange};
  border-radius: 0 0 0.5rem 0.5rem;
  position: absolute;
  right: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 2rem;
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`

const SearchDiv = styled.div``

const SearchBarDiv = styled.div`
  display: flex;
  align-items: center;
`

const SearchBar = styled.input`
  width: 15rem;
  background-color: ${gray["75"]};
  border-radius: 0.25rem 0 0 0.25rem;
  height: 2.25rem;
  color: ${gray["0"]};
  padding: 0 0.5rem;
  font-size: 1rem;

  @media (max-width: 480px) {
    width: 14rem;
  }

  ::placeholder {
    color: ${gray["25"]};
    font-weight: 500;
  }
`

const SearchButton = styled.button`
  border: 0;
  border-radius: 0 0.25rem 0.25rem 0;
  background-color: ${gray["25"]};
  display: flex;
  align-items: center;
  padding: 0.5rem;

  &:hover,
  &:active {
    background-color: ${gray["0"]};
    cursor: pointer;
  }
`

const Text = styled.p`
  color: ${gray["0"]};
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const SearchIcon = styled(BiSearchAlt)`
  color: ${gray["100"]};
  font-size: 1.25rem;
`

export default function SearchDropdown({ showSearch, setShowSearch }) {
  const router = useRouter()
  const [clanSearch, setClanSearch] = useState("")
  const [playerSearch, setPlayerSearch] = useState("")

  const handleClanSearchChange = (e) => {
    setClanSearch(e.target.value)
  }

  const handlePlayerSearchChange = (e) => {
    setPlayerSearch(e.target.value)
  }

  const handleClanSubmit = async () => {
    if (clanSearch.length > 0) {
      setShowSearch(false)

      // check if input is exact tag
      const tagRegex = /^[A-Za-z0-9#]+$/
      const meetsTagReq =
        clanSearch.length >= 5 && clanSearch.length <= 9 && clanSearch.match(tagRegex)

      if (meetsTagReq) {
        try {
          const res = await getClan(clanSearch)
          const data = await res.json()

          router.push(`/clan/${data.tag.substring(1)}`)
        } catch {
          router.push({
            pathname: "/clan/search",
            query: {
              q: clanSearch,
            },
          })
        }
      } else {
        router.push({
          pathname: "/clan/search",
          query: {
            q: clanSearch,
          },
        })
      }
    }
  }

  const handlePlayerSubmit = async () => {
    if (playerSearch.length > 0) {
      setShowSearch(false)

      // check if input is exact tag
      const tagRegex = /^[A-Za-z0-9#]+$/
      const meetsTagReq =
        playerSearch.length >= 5 &&
        playerSearch.length <= 10 &&
        playerSearch.match(tagRegex)

      if (meetsTagReq) {
        try {
          const res = await getPlayer(playerSearch)
          const data = await res.json()

          router.push(`/clan/${data.tag.substring(1)}`)
        } catch {
          router.push({
            pathname: "/player/search",
            query: {
              q: playerSearch,
            },
          })
        }
      } else {
        router.push({
          pathname: "/player/search",
          query: {
            q: playerSearch,
          },
        })
      }
    }
  }

  return showSearch ? (
    <Main>
      <SearchDiv>
        <Text>Players</Text>
        <SearchBarDiv>
          <SearchBar
            placeholder="Name or tag, e.g. VGRQ9CVG"
            onChange={handlePlayerSearchChange}
          />
          <SearchButton onClick={handlePlayerSubmit}>
            <SearchIcon />
          </SearchButton>
        </SearchBarDiv>
      </SearchDiv>

      <SearchDiv>
        <Text>Clans</Text>
        <SearchBarDiv>
          <SearchBar
            onChange={handleClanSearchChange}
            placeholder="Name or tag, e.g. 9U82JJ0Y"
          />
          <SearchButton onClick={handleClanSubmit}>
            <SearchIcon />
          </SearchButton>
        </SearchBarDiv>
      </SearchDiv>
    </Main>
  ) : null
}
