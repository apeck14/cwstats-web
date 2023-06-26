import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import { useState } from "react"
import styled from "styled-components"

import Header from "../../components/Me/Header"
import SubNav from "../../components/Me/SubNav"
import SavedItem from "../../components/Saved/Item"
import clientPromise from "../../lib/mongodb"
import { gray, orange, pink } from "../../public/static/colors"
import { redirect } from "../../utils/functions"
import { authOptions } from "../api/auth/[...nextauth]"

const Content = styled.div`
  background-color: ${gray["75"]};
  min-height: 15rem;
  padding: 1rem;
  margin: 1rem 0 2rem 0;
  border-radius: 0.25rem;
`

const LoadMoreDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const LoadMore = styled.button`
  padding: 0.5rem;
  background-color: ${orange};
  border: none;
  color: ${gray["0"]};
  margin: auto;
  border-radius: 1rem;
  font-weight: 600;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${pink};
  }
`

const NoneText = styled.p`
  color: ${gray["0"]};
  font-style: italic;
`

export default function Players({ players }) {
  const [numShown, setNumShown] = useState(15)

  return (
    <>
      <NextSeo
        title="My Players"
        description="View your saved players on CWStats."
        openGraph={{
          title: "My Players",
          description: "View your saved players on CWStats.",
        }}
      />

      <Header title="My Players" description="View all saved players." />
      <SubNav />
      <Content>
        {players.length === 0 ? (
          <NoneText>No players saved!</NoneText>
        ) : (
          players.slice(0, numShown).map((p) => (
            <SavedItem
              key={p.tag}
              data={p}
              isPlayer
              links={[
                {
                  name: "War",
                  url: `/player/${p.tag.substring(1)}/war`,
                },
                {
                  name: "Battles",
                  url: `/player/${p.tag.substring(1)}/battles`,
                },
                {
                  name: "Cards",
                  url: `/player/${p.tag.substring(1)}/cards`,
                },
              ]}
            />
          ))
        )}
        {players.length > numShown ? (
          <LoadMoreDiv>
            <LoadMore onClick={() => setNumShown(numShown + 15)}>Load More...</LoadMore>
          </LoadMoreDiv>
        ) : null}
      </Content>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const session = await getServerSession(req, res, authOptions)

    if (!session) return redirect(`/login?callback=/me/players`)

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const linkedAccounts = db.collection("Linked Accounts")

    const userId = new ObjectId(session.user.id)

    const user = await accounts.findOne({
      userId,
    })

    const linkedAccount = await linkedAccounts.findOne({
      discordID: user.providerAccountId,
    })

    return {
      props: {
        players: linkedAccount?.savedPlayers || [],
      },
    }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/500",
      },
      props: {},
    }
  }
}
