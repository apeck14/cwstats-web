import styled from "styled-components"

import { gray } from "../../../public/static/colors"

const Main = styled.div({
  display: "flex",
  justifyContent: "center",
})

const Text = styled.h2({
  "@media (max-width: 480px)": {
    fontSize: "1rem",
  },
  color: gray["0"],

  marginTop: "5rem",
})

export default function RaceNotFound() {
  return (
    <Main>
      <Text>Clan is not in an active race.</Text>
    </Main>
  )
}
