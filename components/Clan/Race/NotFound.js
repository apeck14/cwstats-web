import styled from "styled-components"

import { gray } from "../../../public/static/colors"

const Main = styled.div({
  display: "flex",
  justifyContent: "center",
})

const Text = styled.h2({
  color: gray["0"],
  marginTop: "5rem",

  "@media (max-width: 480px)": {
    fontSize: "1rem",
  },
})

export default function RaceNotFound() {
  return (
    <Main>
      <Text>Clan is not in an active race.</Text>
    </Main>
  )
}
