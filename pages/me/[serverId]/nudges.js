import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import Hr from "../../../components/Hr"
import Checkbox from "../../../components/Me/Server/Content/Nudges/Checkbox"
import CustomMessage from "../../../components/Me/Server/Content/Nudges/CustomMessage"
import TabContent from "../../../components/Me/Server/Content/TabContent"
import ServerHeader from "../../../components/Me/Server/Header"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { redirect } from "../../../utils/functions"
import { fetchGuilds } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-bottom: 1rem;
`

const SubHeader = styled.h3`
  color: ${gray["0"]};
  margin: 1rem 0;
`

export default function ServerPage({ guild }) {
  return (
    <>
      <NextSeo
        title={`CWStats - ${guild.name} | Nudges`}
        description="Customize CW2 Stats Discord bot settings for your server!"
        noindex
        openGraph={{
          title: `CWStats - ${guild.name} | Nudges`,
          description:
            "Customize CW2 Stats Discord bot settings for your server!",
        }}
      />
      <ServerHeader name={guild.name} icon={guild.icon} id={guild.guildID} />

      <TabContent>
        <Header>Nudges</Header>
        <Checkbox />
        <SubHeader>Custom Message</SubHeader>
        <CustomMessage />
        <Hr color={gray["50"]} margin="1.5rem 0" />
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

    const [guild, guildsRes] = await Promise.all([
      guilds.findOne({ guildID: serverId }),
      fetchGuilds(user.access_token),
    ])

    if (!guild) return redirect("/404")
    if (!guildsRes.ok) throw new Error()

    const guildsData = await guildsRes.json()

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
      },
    }
  } catch (err) {
    return redirect("/500")
  }
}
