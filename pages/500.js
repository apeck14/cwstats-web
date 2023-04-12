import { NextSeo } from "next-seo"
import styled from "styled-components"

import { gray, pink } from "../public/static/colors"

const Main = styled.div({
  marginTop: "10%",
})

const ErrorCode = styled.h1({
  fontSize: "7.5rem",
  textAlign: "center",
  color: pink,

  "@media (max-width: 480px)": {
    fontSize: "5.5rem",
  },
})

const Header = styled.h1({
  textAlign: "center",
  color: gray["0"],

  "@media (max-width: 480px)": {
    fontSize: "1.3rem",
  },
})

const SubHeader = styled.p({
  textAlign: "center",
  color: gray["25"],
  marginTop: "0.5rem",
  marginBottom: "2rem",
  padding: "0 2rem",

  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },
})

export default function Error500() {
  return (
    <>
      <NextSeo title="500 Unknown Error" />
      <Main>
        <ErrorCode>500</ErrorCode>
        <Header>Internal server error.</Header>
        <SubHeader>
          Something went wrong, and we are working hard to get it fixed.
        </SubHeader>
      </Main>
    </>
  )
}
