import Image from "next/image"
import styled from "styled-components"

import { gray } from "../public/static/colors"

const Main = styled.div({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  padding: "10% 1rem",
})

const SubDiv = styled.div({
  marginLeft: "1rem",
})

const Confetti = styled(Image)({})

const Header = styled.h1({
  "@media (max-width: 480px)": {
    fontSize: "1.3rem",
  },

  color: gray["0"],
})

const SubHeader = styled.h3({
  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },

  color: gray["25"],
})

export default function ComingSoon() {
  return (
    <Main>
      <Confetti src="/assets/icons/confetti.png" height={50} width={50} />
      <SubDiv>
        <Header>Coming soon!</Header>
        <SubHeader>This feature is still in development.</SubHeader>
      </SubDiv>
    </Main>
  )
}
