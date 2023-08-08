import Image from "next/image"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"

const Header = styled.div`
  display: flex;
  column-gap: 0.5rem;
  font-size: 1.75rem;
  justify-content: center;
  background-color: ${gray["100"]};
  padding: 0.5rem;
  border-radius: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

const Name = styled.h3`
  color: ${gray["0"]};
`

const Tag = styled.h3`
  color: ${gray["25"]};
`

const Title = styled.h4`
  color: ${gray["0"]};
  font-size: 1.5rem;
  margin: 1.25rem 0 0.5rem 0;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }
`

const Decks = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`

const DeckContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1rem;

  @media (max-width: 480px) {
    column-gap: 0.5rem;
  }
`

const Deck = styled.div`
  background-color: ${gray["50"]};
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: fit-content;
  display: flex;
`

const NotFound = styled.p`
  color: ${gray["25"]};
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 1rem 0 0.25rem 0;
  }
`

const Explanation = styled(NotFound)`
  margin: 0;
`

const Pink = styled.span`
  color: ${pink};
`

const Card = styled(Image)``

const Icon = styled(Image)``

export default function DeckContent({ player, decks }) {
  const { width } = useWindowSize()

  const missingDecks = 4 - decks.duel.length - decks.other.length

  const isMobile = width <= 480

  return (
    <>
      <Header>
        <Name>{player.name}</Name>
        <Tag>{player.tag}</Tag>
      </Header>

      {decks.duel.length > 0 && (
        <>
          <Title>Most Recent Duel</Title>
          <Decks>
            {decks.duel.map((d) => (
              <DeckContainer>
                <Icon src={`/assets/gamemodes/${d.img}.png`} height={isMobile ? 30 : 50} width={isMobile ? 30 : 50} />
                <Deck>
                  {d.cards.map((c) => (
                    <Card
                      src={`/assets/cards/${c.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")}.png`}
                      height={isMobile ? 42 : 60}
                      width={isMobile ? 35 : 50}
                    />
                  ))}
                </Deck>
              </DeckContainer>
            ))}
          </Decks>
        </>
      )}

      {decks.other.length > 0 && (
        <>
          <Title>Single Decks</Title>
          <Decks>
            {decks.other.map((d) => (
              <DeckContainer>
                <Icon src={`/assets/gamemodes/${d.img}.png`} height={isMobile ? 30 : 50} width={isMobile ? 30 : 50} />
                <Deck>
                  {d.cards.map((c) => (
                    <Card
                      src={`/assets/cards/${c.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")}.png`}
                      height={isMobile ? 42 : 60}
                      width={isMobile ? 35 : 50}
                    />
                  ))}
                </Deck>
              </DeckContainer>
            ))}
          </Decks>
        </>
      )}

      {missingDecks > 0 && (
        <>
          <NotFound>
            <Pink>{missingDecks}</Pink> deck(s) not found.
          </NotFound>
          <Explanation>Battle logs are limited to last 25 matches.</Explanation>
        </>
      )}
    </>
  )
}
