import { signIn } from "next-auth/react"
import { FaDiscord } from "react-icons/fa"
import styled from "styled-components"
import { gray, pink } from "../../../public/static/colors"

const Overlay = styled.div({
    height: "20.5rem",
    maxWidth: "31.375rem",
    borderRadius: "0.3rem",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: gray["50"],
    margin: "0.75rem 1.5rem 0.25rem 1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "@media (max-width: 480px)": {
        height: "13rem",
    },
})

const CenterDiv = styled.div({
    ":hover, :active": {
        opacity: "0.5",
        cursor: "pointer",
    },
})

const TopDiv = styled.div({
    color: gray["25"],
    fontSize: "1.5rem",

    "@media (max-width: 480px)": {
        fontSize: "1.3rem",
    },
})

const BottomDiv = styled.div({
    display: "flex",
    justifyContent: "center",
    color: pink,
    fontSize: "2.5rem",

    "@media (max-width: 480px)": {
        fontSize: "2rem",
    },
})

export default function LoginOverlay() {
    return (
        <Overlay>
            <CenterDiv onClick={() => signIn("discord")}>
                <TopDiv>Log in with</TopDiv>
                <BottomDiv>
                    <FaDiscord />
                </BottomDiv>
            </CenterDiv>
        </Overlay>
    )
}
