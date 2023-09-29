import Image from "next/image"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { IoCaretDown, IoCaretUp } from "react-icons/io5"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"
import { getArenaFileName } from "../../utils/files"
import { formatRole } from "../../utils/functions"

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`

const TH = styled.th`
  color: ${gray["25"]};
  border-bottom: 2px solid ${pink};
  padding: 0.5rem 0.75rem;

  @media (max-width: 480px) {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
`

const SortTh = styled(TH)`
  &:hover {
    cursor: pointer;
    background-color: ${gray["75"]};
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
  }
`

const ThDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.5rem;
`

const Row = styled.tr`
  color: ${gray["0"]};
`

const Cell = styled.td`
  height: 3.5rem;
  padding: 0 0.75rem;
  border-top: 1px solid ${gray["50"]};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $color }) => $color || gray["0"]};

  @media (max-width: 1024px) {
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.4rem;
    font-size: 0.7rem;
  }
`

const Name = styled.span`
  font-size: 1rem;

  &:hover {
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

const Arena = styled(Image)`
  vertical-align: middle;
`

const DownArrow = styled(IoCaretDown)`
  float: right;
`

const UpArrow = styled(IoCaretUp)`
  float: right;
`

const ThIcon = styled(Image)``

const MobileRow = styled.div`
  display: flex;
  column-gap: 0.5rem;
`

const Text = styled.p`
  color: ${({ $color }) => $color || gray["25"]};
`

const roles = ["leader", "coLeader", "elder", "member"]

const sortFunctionsAscending = {
  lastSeen: (a, b) => a.lastSeenDate - b.lastSeenDate,
  level: (a, b) => a.expLevel - b.expLevel,
  name: (a, b) => b.name.localeCompare(a.name),
  rank: (a, b) => b.clanRank - a.clanRank,
  role: (a, b) => roles.indexOf(b.role) - roles.indexOf(a.role),
  trophies: (a, b) => a.trophies - b.trophies,
}

const sortFunctionsDescending = {
  lastSeen: (a, b) => b.lastSeenDate - a.lastSeenDate,
  level: (a, b) => b.expLevel - a.expLevel,
  name: (a, b) => a.name.localeCompare(b.name),
  rank: (a, b) => a.clanRank - b.clanRank,
  role: (a, b) => roles.indexOf(a.role) - roles.indexOf(b.role),
  trophies: (a, b) => b.trophies - a.trophies,
}

export default function MembersTable({ members }) {
  const { width } = useWindowSize()
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({
    direction: "descending",
    key: "rank",
  })

  const toggleSort = (key) => {
    const isSameCol = key === sortConfig.key
    let direction

    if (isSameCol) {
      if (sortConfig.direction === "descending") direction = "ascending"
      else direction = "descending"
    } else direction = "descending"

    setSortConfig({
      direction,
      key,
    })
  }

  const sortedItems = useMemo(() => {
    if (members) {
      const sortableItems = [...members]

      sortableItems.sort(
        sortConfig.direction === "ascending"
          ? sortFunctionsAscending[sortConfig.key]
          : sortFunctionsDescending[sortConfig.key],
      )

      return sortableItems
    }
    return []
  }, [members, sortConfig])

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
          <SortTh key="rank" onClick={() => toggleSort("rank")}>
            <ThDiv>#{showArrow("rank")}</ThDiv>
          </SortTh>
          <TH />
          <SortTh key="trophies" onClick={() => toggleSort("trophies")}>
            <ThDiv>
              {isMobile ? <ThIcon src="/assets/icons/trophy.png" width={12} height={12} /> : "Trophies"}
              {showArrow("trophies")}
            </ThDiv>
          </SortTh>
          <SortTh key="name" onClick={() => toggleSort("name")}>
            <ThDiv>
              Name
              {showArrow("name")}
            </ThDiv>
          </SortTh>
          {!isMobile && (
            <>
              <SortTh key="lastSeen" onClick={() => toggleSort("lastSeen")}>
                <ThDiv>
                  Last Seen
                  {showArrow("lastSeen")}
                </ThDiv>
              </SortTh>
              <SortTh key="role" onClick={() => toggleSort("role")}>
                <ThDiv>
                  Role
                  {showArrow("role")}
                </ThDiv>
              </SortTh>
            </>
          )}
          <SortTh key="level" onClick={() => toggleSort("level")}>
            <ThDiv>
              {isMobile ? <ThIcon src="/assets/icons/level.png" width={12} height={12} /> : "Level"}
              {showArrow("level")}
            </ThDiv>
          </SortTh>
        </Row>
      </thead>

      <tbody>
        {sortedItems.map((m, index) => {
          const backgroundColor = index % 2 === 0 ? "#2e2f30" : gray["75"]

          return (
            <Row key={m.tag}>
              <CenterCell $backgroundColor={backgroundColor}>{m.clanRank}</CenterCell>
              <CenterCell $backgroundColor={backgroundColor}>
                <Arena src={`/assets/arenas/${getArenaFileName(m.trophies)}.png`} height={32} width={32} alt="Arena" />
              </CenterCell>
              <CenterCell $backgroundColor={backgroundColor}>{m.trophies}</CenterCell>
              {isMobile ? (
                <Cell $backgroundColor={backgroundColor}>
                  <MobileRow>
                    <Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>{m.name}</Name>
                  </MobileRow>
                  <MobileRow>
                    <Text>{formatRole(m.role)}</Text>
                    <Text $color={m.color}>{m.lastSeenStr}</Text>
                  </MobileRow>
                </Cell>
              ) : (
                <>
                  <Cell $backgroundColor={backgroundColor}>
                    <Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>{m.name}</Name>
                  </Cell>
                  <CenterCell $backgroundColor={backgroundColor} $color={m.color}>
                    {m.lastSeenStr}
                  </CenterCell>
                  <CenterCell $backgroundColor={backgroundColor} $color={gray["25"]}>
                    {formatRole(m.role)}
                  </CenterCell>
                </>
              )}
              <CenterCell $backgroundColor={backgroundColor} $color={gray["25"]}>
                {m.expLevel}
              </CenterCell>
            </Row>
          )
        })}
      </tbody>
    </Table>
  )
}
