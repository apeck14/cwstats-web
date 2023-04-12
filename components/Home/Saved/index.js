import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { gray } from "../../../public/static/colors"
import DiscordOverlay from "./DiscordOverlay"
import SavedContent from "./SavedContent"

const Main = styled.div`
  background-color: ${gray["75"]};
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 14rem;
  row-gap: 1rem;
  padding: 3rem 0;

  @media (max-width: 1400px) {
    column-gap: 8rem;
  }

  @media (max-width: 1200px) {
    column-gap: 5rem;
  }

  @media (max-width: 528px) {
    padding: 1.5rem 0;
  }
`

const SavedDiv = styled.div``

const SavedHeader = styled.h3`
  font-size: 1.5rem;
  color: ${gray["25"]};
  margin-bottom: 0.5rem;
`

export default function Saved() {
  const { status } = useSession()
  const [savedData, setSavedData] = useState()

  const isLoggedIn = status === "authenticated"

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`/api/user`)
        .then((res) => res.json())
        .then(setSavedData)
        .catch(() => {})
    }
  }, [isLoggedIn])

  return (
    <Main className="full-width">
      <SavedDiv>
        <SavedHeader>My Players</SavedHeader>
        {isLoggedIn ? (
          <SavedContent isPlayers items={savedData?.savedPlayers} />
        ) : (
          <DiscordOverlay />
        )}
      </SavedDiv>
      <SavedDiv>
        <SavedHeader>My Clans</SavedHeader>
        {isLoggedIn ? (
          <SavedContent isPlayers={false} items={savedData?.savedClans} />
        ) : (
          <DiscordOverlay />
        )}
      </SavedDiv>
    </Main>
  )
}
