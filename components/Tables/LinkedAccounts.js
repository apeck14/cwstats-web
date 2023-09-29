import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { FaTrashAlt } from "react-icons/fa"
import { IoCaretDown, IoCaretUp } from "react-icons/io5"
import styled from "styled-components"

import { gray, orange, pink } from "../../public/static/colors"
import { removeLinkedAccount } from "../../utils/services"

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`

const TH = styled.th`
  color: ${gray["25"]};
  border-bottom: 2px solid ${pink};
  padding: 0.5rem 0.75rem;

  @media (max-width: 480px) {
    padding: 0.25rem 0.4rem;
    font-size: 0.9rem;
  }
`

const SortableTH = styled(TH)`
  &:hover {
    cursor: pointer;
    background-color: ${gray["75"]};
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
  }
`

const THDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = styled.span`
  margin: 0 auto;
`

const Row = styled.tr`
  color: ${gray["0"]};
  background-color: ${({ $color }) => $color};
`

const Cell = styled.td`
  height: 3rem;
  padding: 0 1rem;
  border-top: 1px solid ${gray["50"]};
  color: ${({ $color }) => $color || "inherit"};

  @media (max-width: 1024px) {
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    height: 2rem;
    font-size: 0.7rem;
  }
`

const CenterCell = styled(Cell)`
  text-align: center;
`

const CellDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Delete = styled(FaTrashAlt)`
  color: ${orange};

  &:hover {
    color: ${pink};
    cursor: pointer;
  }
`

const DownArrow = styled(IoCaretDown)``

const UpArrow = styled(IoCaretUp)``

export default function LinkedAccountsTable({ accounts, setAccounts }) {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({
    direction: "descending",
    key: "name",
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
    const sortableItems = [...accounts]

    sortableItems.sort((a, b) =>
      sortConfig.direction === "descending"
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]),
    )

    return sortableItems
  }, [accounts, sortConfig])

  const showArrow = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "descending") return <DownArrow />

      return <UpArrow />
    }

    return null
  }

  const handleDelete = (discordID, tag) => {
    setAccounts(accounts.filter((la) => la.discordID !== discordID || la.tag !== tag))

    removeLinkedAccount({ discordID, serverId: router.query.serverId, tag })
  }

  return (
    <Table>
      <thead>
        <Row>
          <SortableTH key="name" onClick={() => toggleSort("name")}>
            <THDiv>
              <Header>Player</Header>
              {showArrow("name")}
            </THDiv>
          </SortableTH>
          <SortableTH key="tag" onClick={() => toggleSort("tag")}>
            <THDiv>
              <Header>Tag</Header>
              {showArrow("tag")}
            </THDiv>
          </SortableTH>
          <SortableTH key="discordID" onClick={() => toggleSort("discordID")}>
            <THDiv>
              <Header>Discord ID</Header>
              {showArrow("discordID")}
            </THDiv>
          </SortableTH>
          <TH />
        </Row>
      </thead>

      <tbody>
        {sortedItems.map((m, index) => {
          const backgroundColor = index % 2 === 0 ? "#2e2f30" : gray["75"]

          return (
            <Row key={`${m.tag}${m.discordID}`} $color={backgroundColor}>
              <Cell>{m.name}</Cell>
              <CenterCell $color={gray["25"]}>{m.tag}</CenterCell>
              <CenterCell $color={gray["25"]}>{m.discordID}</CenterCell>
              <CenterCell>
                <CellDiv>
                  <Delete onClick={() => handleDelete(m.discordID, m.tag)} />
                </CellDiv>
              </CenterCell>
            </Row>
          )
        })}
      </tbody>
    </Table>
  )
}
