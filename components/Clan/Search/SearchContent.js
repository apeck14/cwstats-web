import styled from "styled-components"

import { gray } from "../../../public/static/colors"
import SearchItem from "./SearchItem"

const Main = styled.div`
  background-color: ${gray["75"]};
  min-height: 20rem;
  padding: 1rem;
  margin-bottom: 1rem;
`

const NoClans = styled.p`
  color: ${gray["25"]};
  font-style: italic;
`

export default function SearchContent({ isPlayers, results, skeleton }) {
  if (skeleton) {
    return [1, 2, 3].map((n) => <SearchItem key={n} skeleton />)
  }

  return (
    <Main>
      {results.length > 0 ? (
        results.map((item) => (
          <SearchItem isPlayer={isPlayers} item={item} key={item.tag} />
        ))
      ) : (
        <NoClans>No {isPlayers ? "players" : "clans"} found</NoClans>
      )}
    </Main>
  )
}
