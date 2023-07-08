import Image from "next/image"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import SpySearchBar from "../components/SpySearchBar"
import { gray } from "../public/static/colors"
import { redirect } from "../utils/functions"
import { getPlayersFromSearch } from "./api/search/player"

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

const SubHeader = styled.h3`
  color: ${gray["25"]};
  text-align: center;
  margin-top: 0.5rem;
`

const SearchBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
`

const Art = styled(Image)``

export default function Spy() {
  const router = useRouter()
  const { q } = router.query

  return (
    <>
      <NextSeo
        title="Deck Spy | CWStats"
        description="Search for your opponent's war decks in real-time!"
        openGraph={{
          title: "Deck Spy | CWStats",
          description: "Search for your opponent's war decks in real-time!",
        }}
      />

      <Header>Deck Spy</Header>
      <SubHeader>View your opponent&apos;s war decks in real time!</SubHeader>

      <SearchBarDiv>
        <SpySearchBar
          defaultValue={q}
          placeholder="Name or tag, e.g. 9U82JJ0Y"
          isPlayerSearch
          showLiveResults
        />
      </SearchBarDiv>

      <Content>
        <Art
          className="noselect"
          draggable={false}
          src="/assets/art/warrior-women.png"
          height={409}
          width={640}
          priority
        />
      </Content>
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
