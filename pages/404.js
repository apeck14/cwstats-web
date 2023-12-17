import { NextSeo } from "next-seo"
import styled from "styled-components"

import { gray, pink } from "../public/static/colors"

const Main = styled.div({
  marginTop: "10%",
})

const ErrorCode = styled.h1({
  "@media (max-width: 480px)": {
    fontSize: "5.5rem",
  },
  color: pink,
  fontSize: "7.5rem",

  textAlign: "center",
})

const Header = styled.h1({
  "@media (max-width: 480px)": {
    fontSize: "1.3rem",
  },
  color: gray["0"],

  textAlign: "center",
})

const SubHeader = styled.p({
  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },
  color: gray["25"],
  marginBottom: "2rem",
  marginTop: "0.5rem",
  padding: "0 2rem",

  textAlign: "center",
})

export default function Error404() {
  return (
    <>
      <NextSeo title="404 Not Found" />
      <Main>
        <ErrorCode>404</ErrorCode>
        <Header>Oops! Not found.</Header>
        <SubHeader>What you&apos;re looking for was deleted, or doesn&apos;t exist.</SubHeader>
      </Main>
    </>
  )
}
