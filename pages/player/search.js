import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import SearchContent from "../../components/Clan/Search/SearchContent"
import SearchBar from "../../components/Home/SearchBar"
import { gray, orange } from "../../public/static/colors"
import { redirect } from "../../utils/functions"
import { getPlayersFromSearch } from "../api/search/player"

const Header = styled.h1`
  color: ${gray["0"]};
  font-size: 3.5rem;
  text-align: center;
  margin-top: 3rem;

  @media (max-width: 480px) {
    margin-top: 2rem;
    font-size: 2.5rem;
  }
`

const SearchBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`

const HeaderDiv = styled.div`
  background-color: ${gray["75"]};
  padding: 1rem;
  margin-top: 2rem;
  border-bottom: 2px solid ${orange};
  border-radius: 0.5rem 0.5rem 0 0;
`

const Text = styled.p`
  color: ${gray["0"]};

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const Gray = styled.span`
  color: ${gray["25"]};
`

export default function PlayerSearch({ results }) {
  const router = useRouter()
  const { q } = router.query

  return (
    <>
      <NextSeo
        title="Player Search"
        description="Search for players on CWStats."
        openGraph={{
          title: "Player Search",
          description: "Search for players on CWStats.",
        }}
      />

      <Header>Player Search</Header>

      <SearchBarDiv>
        <SearchBar
          defaultValue={q}
          placeholder="Name or tag, e.g. 9U82JJ0Y"
          isPlayerSearch
        />
      </SearchBarDiv>

      <HeaderDiv>
        <Text>
          Showing top {results.length} search result(s).{" "}
          <Gray>Search by tag if you cannot find player by name.</Gray>
        </Text>
      </HeaderDiv>

      <SearchContent results={results} isPlayers />
    </>
  )
}

export async function getServerSideProps({ query }) {
  try {
    const { q } = query || {}

    const { players } = await getPlayersFromSearch(q)

    return {
      props: {
        results: JSON.parse(JSON.stringify(players || [])),
      },
    }
  } catch (err) {
    console.log(err)
    return redirect("/500")
  }
}
