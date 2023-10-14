import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"

const Header = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: 0.5rem;
  align-items: center;
  font-size: 1.5rem;
  background-color: ${gray["100"]};
  padding: 0.5rem;
  border-radius: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

const Name = styled(Link)`
  color: ${gray["0"]};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: ${pink};
  }
`

const Clan = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const Badge = styled(Image)``

const ClanName = styled(Name)`
  font-size: 1.1rem;
  color: ${gray["25"]};

  &:hover {
    color: ${({ isInClan }) => isInClan && pink};
  }
`

const Title = styled.h4`
  color: ${gray["0"]};
  font-size: 1.5rem;
  margin: 1.25rem 0 0.5rem 0;

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin: 1rem 0 0.5rem 0;
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
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    column-gap: 1rem;
    row-gap: 0.25rem;
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

const Timestamp = styled.p`
  color: ${gray["25"]};

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

export default function DeckContent({ decks, player }) {
  const { width } = useWindowSize()

  const missingDecks = 4 - decks.duel.length - decks.other.length

  const isMobile = width <= 480
  const clanBadgeHeight = isMobile ? 22 : 26
  const clanBadgeWidth = isMobile ? 16 : 20

  return (
    <>
      <Header>
        <Name href={`/player/${player?.tag?.substring(1)}`}>{player?.name}</Name>
        <Clan>
          <Badge
            height={clanBadgeHeight}
            src={`/assets/badges/${player?.badge}.png`}
            unoptimized
            width={clanBadgeWidth}
          />
          <ClanName href={player?.clanTag ? `/clan/${player?.clanTag?.substring(1)}` : ""} isInClan={player?.clanTag}>
            {player?.clanName || "None"}
          </ClanName>
        </Clan>
      </Header>

      {decks.duel.length > 0 && (
        <>
          <Title>Most Recent Duel</Title>
          <Decks>
            {decks.duel.map((d) => (
              <DeckContainer>
                <Icon height={isMobile ? 30 : 50} src={`/assets/gamemodes/${d.img}.png`} width={isMobile ? 30 : 50} />
                <Deck>
                  {d.cards.map((c) => (
                    <Card
                      height={isMobile ? 42 : 60}
                      src={`/assets/cards/${c.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")}.png`}
                      unoptimized
                      width={isMobile ? 35 : 50}
                    />
                  ))}
                </Deck>
                <Timestamp>{d.dateStr}</Timestamp>
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
                <Icon height={isMobile ? 30 : 50} src={`/assets/gamemodes/${d.img}.png`} width={isMobile ? 30 : 50} />
                <Deck>
                  {d.cards.map((c) => (
                    <Card
                      height={isMobile ? 42 : 60}
                      src={`/assets/cards/${c.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")}.png`}
                      unoptimized
                      width={isMobile ? 35 : 50}
                    />
                  ))}
                </Deck>
                <Timestamp>{d.dateStr}</Timestamp>
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
