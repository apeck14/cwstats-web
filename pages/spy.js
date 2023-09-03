import Image from "next/image"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useState } from "react"
import { TbSpy } from "react-icons/tb"
import styled from "styled-components"

import LoadingSpinner from "../components/LoadingSpinner"
import DeckContent from "../components/Spy/DeckContent"
import SpySearchBar from "../components/Spy/SpySearchBar"
import useWindowSize from "../hooks/useWindowSize"
import { gray, pink } from "../public/static/colors"

const Header = styled.h1`
  color: ${gray["0"]};
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`

const SubHeader = styled.h3`
  color: ${gray["25"]};
  margin-top: 0.5rem;

  @media (max-width: 1024px) {
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`

const SearchBarDiv = styled.div`
  display: flex;
  margin-top: 1.5rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${gray["75"]};
  padding: 1rem;
  border-radius: 0.5rem;
  min-height: 18rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    min-height: 15rem;
  }
`

const Art = styled(Image)``

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0;

  @media (max-width: 1024px) {
    padding: 1rem;
    margin: 0;
    justify-content: center;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const DefaultMessage = styled.p`
  color: ${gray["25"]};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  margin: auto;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

const LoadingDecks = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  margin: auto;
`

const LoadingDecksText = styled.p`
  color: ${gray["0"]};
  font-size: 1.5rem;
  font-weight: 700;
`

const SpyIcon = styled(TbSpy)`
  color: ${pink};
`

export default function Spy() {
  const router = useRouter()
  const { width } = useWindowSize()
  const [showDecksSpinner, setShowDecksSpinner] = useState(false)
  const [decks, setDecks] = useState(null)
  const [player, setPlayer] = useState(null)
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

      <HeaderContent>
        <Column>
          <Header>
            <SpyIcon />
            Deck Spy
          </Header>
          <SubHeader>View your opponent&apos;s war decks in real time!</SubHeader>
          <SearchBarDiv>
            <SpySearchBar
              defaultValue={q}
              placeholder="Search player..."
              isPlayerSearch
              showLiveResults
              setShowDecksSpinner={setShowDecksSpinner}
              setDecks={setDecks}
              setPlayer={setPlayer}
            />
          </SearchBarDiv>
        </Column>
        {width > 1024 && (
          <Art
            className="noselect"
            draggable={false}
            src="/assets/art/warrior-women.png"
            height={175}
            width={275}
            priority
          />
        )}
      </HeaderContent>

      <Content>
        {showDecksSpinner ? (
          <LoadingDecks>
            <LoadingDecksText>Searching...</LoadingDecksText>
            <LoadingSpinner size="1.5rem" lineWidth={3} color={pink} />
          </LoadingDecks>
        ) : decks ? (
          <DeckContent decks={decks} player={player} />
        ) : (
          <DefaultMessage>
            Use the search bar above to find your opponent&apos;s war decks! {width > 480 && <SpyIcon />}
          </DefaultMessage>
        )}
      </Content>
    </>
  )
}
