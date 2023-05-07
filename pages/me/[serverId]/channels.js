import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import Abbreviations from "../../../components/Me/Server/Content/Abbreviations"
import ServerHeader from "../../../components/Me/Server/Header"
import SubNav from "../../../components/Me/Server/SubNav"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { redirect } from "../../../utils/functions"
import { fetchGuildChannels, fetchGuilds } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const SubHeader = styled.h2`
  font-size: 1.25rem;
  color: ${gray["25"]};

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

const TabContent = styled.div`
  background-color: ${gray["75"]};
  border-radius: 0.5rem;
  min-height: 20rem;
  padding: 2rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    padding: 1rem;
    margin: 1rem 0;
  }
`

export default function ServerPage({ guild }) {
  return (
    <>
      <NextSeo
        title={`CWStats - ${guild.name}`}
        description="Customize CW2 Stats Discord bot settings for your server!"
        noindex
        openGraph={{
          title: `CWStats - ${guild.name}`,
          description:
            "Customize CW2 Stats Discord bot settings for your server!",
        }}
      />
      <ServerHeader name={guild.name} icon={guild.icon} id={guild.guildID} />

      <SubHeader>
        Customize CW2 Stats Discord bot settings for your server!
      </SubHeader>

      <SubNav />

      <TabContent>
        <Abbreviations
          abbrList={guild.abbreviations}
          defaultClan={guild.defaultClan}
        />
      </TabContent>
    </>
  )
}

export async function getServerSideProps({ req, res, params }) {
  try {
    const { serverId } = params

    // check for numbers only
    if (!serverId.match(/^\d+$/)) return redirect("/404")

    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const session = await getServerSession(req, res, authOptions)

    if (!session) return redirect("/login")

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")
    const accounts = db.collection("accounts")

    const userId = new ObjectId(session.user.id)

    const user = await accounts.findOne({
      userId,
    })

    const [guild, guildsRes, channelsRes] = await Promise.all([
      guilds.findOne({ guildID: serverId }),
      fetchGuilds(user.access_token),
      fetchGuildChannels(serverId, user.access_token),
    ])

    if (!guild) return redirect("/404")
    if (!guildsRes.ok || !channelsRes.ok) throw new Error()

    const [guildsData, channelsData] = await Promise.all([
      guildsRes.json(),
      channelsRes.json(),
    ])

    const textChannels = channelsData
      .filter((c) => c.type === 0)
      .map(({ id, name }) => ({ id, name }))

    const guildFound = guildsData.find((g) => g.id === serverId)

    if (!guildFound) return redirect("/404")

    const { icon, name } = guildFound

    return {
      props: {
        guild: JSON.parse(
          JSON.stringify({
            ...guild,
            icon,
            name,
          })
        ),
        channels: textChannels,
      },
    }
  } catch (err) {
    return redirect("/500")
  }
}
