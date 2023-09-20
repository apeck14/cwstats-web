import Link from "next/link"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import Header from "../../components/Me/Header"
import Item from "../../components/Me/Servers/Item"
import SubNav from "../../components/Me/SubNav"
import clientPromise from "../../lib/mongodb"
import { gray, pink } from "../../public/static/colors"
import { DISCORD_BOT_INVITE_LINK } from "../../utils/constants"
import { redirect } from "../../utils/functions"
import { fetchGuilds } from "../../utils/services"
import { authOptions } from "../api/auth/[...nextauth]"

const Content = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 2rem 0;
  padding: 2rem 0;
  background-color: ${gray["75"]};
  justify-content: space-evenly;
  border-radius: 0.5rem;
  min-height: 12rem;
`

const NoGuilds = styled.p`
  color: ${gray["25"]};
  margin: auto;
`

const Here = styled(Link)`
  text-decoration: none;
  color: ${pink};

  &:hover {
    text-decoration: underline;
  }
`

export default function Me({ guilds }) {
  return (
    <>
      <NextSeo
        title="My CWStats"
        description="View your saved players, clans, and customize CWStats Discord bot settings for your servers."
        openGraph={{
          title: "My CWStats",
          description:
            "View your saved players, clans, and customize CWStats Discord bot settings for your servers.",
        }}
      />

      <Header
        title="My CWStats"
        description="Manage your Discord servers, saved clans, and players!"
      />
      <SubNav />
      <Content>
        {guilds.length === 0 ? (
          <NoGuilds>
            No servers to manage! Invite the bot{" "}
            <Here href={DISCORD_BOT_INVITE_LINK}>here</Here>.
          </NoGuilds>
        ) : (
          guilds.map((g) => <Item key={g.id} guild={g} />)
        )}
      </Content>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return redirect(`/login?callback=/me`)
    }

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const guilds = db.collection("Guilds")

    const userId = new ObjectId(session.user.id)

    const user = await accounts.findOne({
      userId,
    })

    const guildsRes = await fetchGuilds(user?.access_token)
    const rawGuilds = await guildsRes.json()

    if (!Array.isArray(rawGuilds)) {
      if (typeof rawGuilds === "object") {
        if (rawGuilds?.message === "401: Unauthorized") {
          accounts.deleteOne(user)

          return redirect(`/login?callback=/me`)
        }
      }

      return redirect("/500")
    }

    const botGuildIds = await guilds.distinct("guildID")

    const hasPermissions = (permissions) => {
      const ADMIN = 0x8
      const MANAGE = 0x20 // MANAGE_GUILD

      return (permissions & MANAGE) === MANAGE || (permissions & ADMIN) === ADMIN
    }

    const filteredGuilds = rawGuilds
      .filter(
        (g) => (g.owner || hasPermissions(g.permissions)) && botGuildIds.includes(g.id)
      )
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      props: {
        guilds: filteredGuilds,
      },
    }
  } catch {
    return redirect("/500")
  }
}
