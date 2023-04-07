import { NextSeo } from "next-seo"
import styled from "styled-components"
import { gray, pink } from "../public/static/colors"

const Main = styled.div({
    margin: "auto",
    width: "70rem",
    fontFamily: "SansPro700",

    "@media (max-width: 1200px)": {
        width: "80%",
    },

    "@media (max-width: 1024px)": {
        width: "100%",
    },
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

export default function Error429() {
    return (
        <>
            <NextSeo title="429 Rate Limit" />
            <Main>
                <ErrorCode>429</ErrorCode>
                <Header>Rate limit reached.</Header>
                <SubHeader>
                    There are too many requests being made at this time. Check
                    back soon.
                </SubHeader>
            </Main>
        </>
    )
}
