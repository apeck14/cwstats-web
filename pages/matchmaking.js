import { NextSeo } from "next-seo"
import styled from "styled-components"

import Spinner from "../components/Spinner"
import { gray } from "../public/static/colors"

const Main = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: "5rem",
})

const Header = styled.h1({
  "@media (max-width: 480px)": {
    fontSize: "1.3rem",
  },
  color: gray["0"],

  marginTop: "1.5rem",
})

const SubHeader = styled.h2({
  "@media (max-width: 480px)": {
    fontSize: "1rem",
  },
  color: gray["25"],

  marginTop: "0.5rem",
})

export default function Matchmaking() {
  return (
    <>
      <NextSeo
        description="Matchmaking is currently underway for the specified clan. Check back soon."
        openGraph={{
          description: "Matchmaking is currently underway for the specified clan. Check back soon.",
          title: "Matchmaking...",
        }}
        title="Matchmaking..."
      />

      <Main>
        <Spinner />
        <Header>Matchmaking in progress.</Header>
        <SubHeader>Check back soon.</SubHeader>
      </Main>
    </>
  )
}
