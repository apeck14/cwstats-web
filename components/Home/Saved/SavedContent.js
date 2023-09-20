import Link from "next/link"
import styled from "styled-components"

import { gray, orange } from "../../../public/static/colors"
import Hr from "../../Hr"
import SavedItem from "./SavedItem"

const Main = styled.div`
  height: 22.5rem;
  width: 30rem;
  background-color: ${gray["100"]};
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 0.5rem;
  box-shadow: ${gray["100"]} 0px 3px 8px;

  @media (max-width: 528px) {
    height: 17.5rem;
    width: 85vw;
  }
`

const NoneSaved = styled.p`
  font-style: italic;
  color: ${gray["25"]};
`

const ViewAll = styled(Link)`
  color: ${orange};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function SavedContent({ isPlayers, items }) {
  const itemsLoaded = Array.isArray(items)

  if (itemsLoaded) {
    const lastIndex = itemsLoaded.length < 5 ? itemsLoaded.length : 5

    return (
      <>
        <Main>
          {items.length === 0 ? (
            <NoneSaved>No {isPlayers ? "players" : "clans"} saved!</NoneSaved>
          ) : (
            items.slice(0, lastIndex).map((e, index) => (
              <>
                <SavedItem key={e.tag} data={e} isPlayer={isPlayers} />
                {index !== lastIndex - 1 && <Hr margin="0.25rem 0" />}
              </>
            ))
          )}
        </Main>
        {items.length > 5 && (
          <ViewAll href={isPlayers ? "/me/players" : "/me/clans"}>View All...</ViewAll>
        )}
      </>
    )
  }

  return (
    <Main>
      {[1, 2, 3, 4, 5].map((e, index) => (
        <>
          <SavedItem key={e} skeleton />
          {index !== 4 && <Hr margin="0.25rem 0" />}
        </>
      ))}
    </Main>
  )
}
