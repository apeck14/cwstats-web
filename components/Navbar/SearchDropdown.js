import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"
import { getClan } from "../../utils/services"

const Main = styled.div({
  backgroundColor: gray["50"],
  borderTop: `2px solid ${pink}`,
  borderBottomLeftRadius: "0.5rem",
  borderBottomRightRadius: "0.5rem",
  position: "absolute",
  right: 0,
  top: "4.4rem",
  padding: "2rem",
  zIndex: 1,
})

const SearchDiv = styled.div({})

const SearchBarDiv = styled.div({
  height: "2rem",
  display: "flex",
  alignItems: "center",
})

const SearchBar = styled.input({
  width: "15rem",
  backgroundColor: gray["75"],
  borderTopLeftRadius: "0.25rem",
  borderBottomLeftRadius: "0.25rem",
  height: "2.25rem",
  color: gray["0"],
  padding: "0 0.6rem",
  fontSize: "1rem",

  "@media (max-width: 480px)": {
    width: "12rem",
  },

  "::placeholder": {
    color: gray["25"],
  },
})

const SearchButton = styled.button({
  height: "2.25rem",
  borderWidth: "0",
  borderTopRightRadius: "0.25rem",
  borderBottomRightRadius: "0.25rem",
  backgroundColor: gray["25"],
  display: "inline-flex",
  alignItems: "center",
  padding: "0.5rem",

  ":hover, :active": {
    backgroundColor: gray["0"],
    cursor: "pointer",
  },
})

const Text = styled.p({
  color: gray["0"],
  fontSize: "1.1rem",
  marginBottom: "0.5rem",
})

const SearchIcon = styled(BiSearchAlt)({
  color: gray["100"],
  fontSize: "1.25rem",
})

export default function SearchDropdown({ showSearch, setShowSearch }) {
  const router = useRouter()
  const [clanSearch, setClanSearch] = useState("")

  const handleClanSearchChange = (e) => {
    setClanSearch(e.target.value)
  }

  const handleClanSubmit = async () => {
    if (clanSearch.length > 0) {
      setShowSearch(false)

      // check if input is exact tag
      const tagRegex = /^[A-Za-z0-9#]+$/
      const meetsTagReq =
        clanSearch.length >= 5 &&
        clanSearch.length <= 9 &&
        clanSearch.match(tagRegex)

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

  const handlePlayerSubmit = () => {
    setShowSearch(false)
    router.push(`/player/search`)
  }

  return showSearch ? (
    <Main>
      <SearchDiv>
        <Text>Players</Text>
        <SearchBarDiv>
          <SearchBar placeholder="Name or tag, e.g. VGRQ9CVG" />
          <SearchButton onClick={handlePlayerSubmit}>
            <SearchIcon />
          </SearchButton>
        </SearchBarDiv>
      </SearchDiv>

      <SearchDiv
        style={{
          marginTop: "1rem",
        }}
      >
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
