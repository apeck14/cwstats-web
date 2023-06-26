import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { signIn } from "next-auth/react"
import { NextSeo } from "next-seo"
import { FaDiscord } from "react-icons/fa"
import styled from "styled-components"

import { gray, orange, pink } from "../public/static/colors"
import { redirect } from "../utils/functions"
import { authOptions } from "./api/auth/[...nextauth]"

const Main = styled.div`
  margin: 15% auto;
  max-width: 90%;
  text-align: center;
`

const Header = styled.h1`
  color: ${gray["0"]};
`

const SubHeader = styled.h2`
  color: ${gray["25"]};
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
`

const LoginBtn = styled.button`
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 1rem;
  border-radius: 1rem;
  border-width: 0;
  background-color: ${pink};
  color: ${gray["0"]};
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 600;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }
`

const DiscordIcon = styled(FaDiscord)`
  font-size: 1.1rem;
  padding-right: 0.4rem;
`

export default function Login({ loggedIn }) {
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
        <Header>
          {loggedIn ? "You are already logged in!" : "You are not logged in."}
        </Header>

        <SubHeader>
          {loggedIn
            ? "Go enjoy all of the neat features!"
            : "To access the full site, please log in with Discord."}
        </SubHeader>

        {!loggedIn && (
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
        )}
      </Main>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions)

    return {
      props: {
        loggedIn: !!session,
      },
    }
  } catch (err) {
    return redirect("/500")
  }
}
