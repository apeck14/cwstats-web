import { signIn } from "next-auth/react"
import { FaDiscord } from "react-icons/fa"
import styled from "styled-components"

import { gray, pink } from "../../../public/static/colors"

const Main = styled.div`
  height: 22.5rem;
  width: 30rem;
  border-radius: 0.5rem;
  border-width: 0.4rem;
  border-style: solid;
  border-color: ${gray["50"]};
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  :hover,
  :active {
    background-color: ${gray["100"]};
    cursor: pointer;
  }

  @media (max-width: 33rem) {
    height: 17.5rem;
    width: 85vw;
  }
`

const Text = styled.p`
  color: ${gray["25"]};
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`

const DiscordIcon = styled(FaDiscord)`
  font-size: 2.5rem;
  color: ${pink};

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

export default function DiscordOverlay() {
  return (
    <Main onClick={() => signIn("discord")}>
      <Text>Log in with</Text>
      <DiscordIcon />
    </Main>
  )
}
