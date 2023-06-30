import Image from "next/image"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { IoCaretDown, IoCaretUp } from "react-icons/io5"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink, red } from "../../public/static/colors"

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`

const TH = styled.th`
  color: ${gray["25"]};
  border-bottom: 2px solid ${pink};
  padding: 0.5rem 0.75rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0.4rem;
  }
`

const SortTh = styled(TH)`
  :hover,
  :active {
    cursor: pointer;
    background-color: ${gray["75"]};
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
  }
`

const Row = styled.tr`
  color: ${gray["0"]};
`

const Cell = styled.td`
  height: 2.5rem;
  padding: 0 1rem;
  border-top: 1px solid ${gray["50"]};
  background-color: ${({ backgroundColor }) => backgroundColor};

  @media (max-width: 1024px) {
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.4rem;
    font-size: 0.7rem;
    height: 2rem;
  }
`

const Name = styled.span`
  font-size: 1rem;

  :hover,
  :active {
    cursor: pointer;
    color: ${pink};
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const CenterCell = styled(Cell)`
  text-align: center;
`

const ThDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.5rem;
`

const DownArrow = styled(IoCaretDown)``

const UpArrow = styled(IoCaretUp)``

const ThIcon = styled(Image)``

const sortFunctionsAscending = {
  name: (a, b) => b.name.localeCompare(a.name),
  decksRemaining: (a, b) => a.decksUsedToday - b.decksUsedToday,
  totalDecks: (a, b) => a.decksUsed - b.decksUsed,
  boats: (a, b) => a.boatAttacks - b.boatAttacks,
  fame: (a, b) => b.rank - a.rank,
}

const sortFunctionsDescending = {
  name: (a, b) => a.name.localeCompare(b.name),
  decksRemaining: (a, b) => b.decksUsedToday - a.decksUsedToday,
  totalDecks: (a, b) => b.decksUsed - a.decksUsed,
  boats: (a, b) => b.boatAttacks - a.boatAttacks,
  fame: (a, b) => a.rank - b.rank,
}

export default function RaceLeaderboard({ participants }) {
  const { width } = useWindowSize()
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({
    key: "fame",
    direction: "descending",
  })

  const toggleSort = (key) => {
    const isSameCol = key === sortConfig.key
    let direction

    if (isSameCol) {
      if (sortConfig.direction === "descending") direction = "ascending"
      else direction = "descending"
    } else direction = "descending"

    setSortConfig({
      key,
      direction,
    })
  }

  const sortedItems = useMemo(() => {
    if (participants) {
      const sortableItems = [...participants]

      sortableItems.sort(
        sortConfig.direction === "ascending"
          ? sortFunctionsAscending[sortConfig.key]
          : sortFunctionsDescending[sortConfig.key]
      )

      return sortableItems
    }
    return []
  }, [participants, sortConfig])

  const showArrow = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "descending") return <DownArrow />

      return <UpArrow />
    }

    return null
  }

  const isMobile = width <= 480

  return (
    <Table>
      <thead>
        <Row>
          <TH>#</TH>
          <SortTh key="name" onClick={() => toggleSort("name")}>
            <ThDiv>
              Player
              {showArrow("name")}
            </ThDiv>
          </SortTh>
          <SortTh key="decksRemaining" onClick={() => toggleSort("decksRemaining")}>
            <ThDiv>
              {isMobile ? (
                <ThIcon src="/assets/icons/decksRemaining.png" width={12} height={12} />
              ) : (
                "Decks Used Today"
              )}
              {showArrow("decksRemaining")}
            </ThDiv>
          </SortTh>
          <SortTh key="totalDecks" onClick={() => toggleSort("totalDecks")}>
            <ThDiv>
              {isMobile ? (
                <ThIcon src="/assets/icons/decks.png" width={12} height={12} />
              ) : (
                "Decks Used"
              )}
              {showArrow("totalDecks")}
            </ThDiv>
          </SortTh>
          <SortTh key="boats" onClick={() => toggleSort("boats")}>
            <ThDiv>
              {isMobile ? (
                <ThIcon
                  src="/assets/icons/boat-attack-points.png"
                  width={13}
                  height={12}
                />
              ) : (
                "Boat Attacks"
              )}
              {showArrow("boats")}
            </ThDiv>
          </SortTh>
          <SortTh key="fame" onClick={() => toggleSort("fame")}>
            <ThDiv>
              {isMobile ? (
                <ThIcon src="/assets/icons/fame.png" width={9} height={12} />
              ) : (
                "Medals"
              )}
              {showArrow("fame")}
            </ThDiv>
          </SortTh>
        </Row>
      </thead>

      <tbody>
        {sortedItems.map((m, index) => {
          const backgroundColor = !m.inClan
            ? red
            : index % 2 === 0
            ? "#2e2f30"
            : gray["75"]

          return (
            <Row key={m.tag}>
              <CenterCell backgroundColor={backgroundColor}>{m.rank}</CenterCell>
              <Cell backgroundColor={backgroundColor}>
                <Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>
                  {m.name}
                </Name>
              </Cell>
              <CenterCell backgroundColor={backgroundColor}>
                {m.decksUsedToday}
              </CenterCell>
              <CenterCell backgroundColor={backgroundColor}>{m.decksUsed}</CenterCell>
              <CenterCell backgroundColor={backgroundColor}>{m.boatAttacks}</CenterCell>
              <CenterCell backgroundColor={backgroundColor}>{m.fame}</CenterCell>
            </Row>
          )
        })}
      </tbody>
    </Table>
  )
}
