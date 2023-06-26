import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { NextSeo } from "next-seo"
import { FaDiscord } from "react-icons/fa"
import styled from "styled-components"

import { gray, orange, pink } from "../public/static/colors"

const Main = styled.div({
  margin: "15% auto",
  maxWidth: "90%",
  textAlign: "center",
})

const Header = styled.h1({
  color: gray["0"],
})

const SubHeader = styled.h2({
  color: gray["25"],
  fontSize: "1rem",
  fontWeight: 500,
  marginTop: "0.5rem",
})

const LoginBtn = styled.button({
  display: "flex",
  alignItems: "center",
  margin: "0 auto",
  marginTop: "1rem",
  borderRadius: "1rem",
  borderWidth: "0",
  backgroundColor: pink,
  color: gray["0"],
  padding: "0.5rem 1rem",
  fontFamily: "inherit",

  ":hover, :active": {
    cursor: "pointer",
    backgroundColor: orange,
  },
})

const DiscordIcon = styled(FaDiscord)({
  fontSize: "1rem",
  paddingRight: "0.4rem",
})

export default function Login() {
  const router = useRouter()
  return (
    <>
      <NextSeo
        title="Login"
        description="Log in to CWStats to save clans, players, and customize CWStats Discord bot settings for your servers."
        openGraph={{
          title: "Login",
          description:
            "Log in to CWStats to save clans, players, and customize CWStats Discord bot settings for your servers.",
        }}
      />

      <Main>
        <Header>You are not logged in.</Header>
        <SubHeader>To access the full site, please log in with Discord.</SubHeader>
        <LoginBtn
          onClick={() =>
            signIn("discord", {
              callbackUrl: router.query.callback || "/",
            })
          }
        >
          <DiscordIcon />
          Log In
        </LoginBtn>
      </Main>
    </>
  )
}
