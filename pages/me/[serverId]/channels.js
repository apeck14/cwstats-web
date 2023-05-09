import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import { useState } from "react"
import styled from "styled-components"

import ChannelCard from "../../../components/Me/Server/Content/Channels/ChannelCard"
import UnsavedChangesModal from "../../../components/Me/Server/Content/Channels/UnsavedChangesModal"
import TabContent from "../../../components/Me/Server/Content/TabContent"
import ServerHeader from "../../../components/Me/Server/Header"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { arraysAreEqual, redirect } from "../../../utils/functions"
import {
  fetchGuildChannels,
  fetchGuilds,
  setGuildChannels,
} from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-bottom: 1rem;
`

const SingleDiv = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`

const typeToProp = {
  Applications: "applicationsChannelID",
  Apply: "applyChannelID",
  Commands: "commandChannelIDs",
  "War Report": "reportChannelID",
}

export default function ServerPage({ guild, channels }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showSaveSpinner, setShowSaveSpinner] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [savedChannels, setSavedChannels] = useState(guild.channels)
  const [unsavedChannels, setUnsavedChannels] = useState(guild.channels)

  const { applicationsChannelID, applyChannelID, reportChannelID } =
    guild.channels

  const handleChange = (channel, type) => {
    const newProp = typeToProp[type]

    const unsavedObj = { ...unsavedChannels }

    if (type === "Commands") {
      if (unsavedObj[newProp].includes(channel.id)) {
        unsavedObj[newProp] = unsavedObj[newProp].filter(
          (id) => id !== channel.id
        )
      } else {
        unsavedObj[newProp] = [...unsavedObj[newProp], channel.id]
      }
    } else unsavedObj[newProp] = channel.id

    setUnsavedChannels({ ...unsavedObj })

    // check for differences in saved and unsaved to determine showModal
    for (const key of Object.keys(unsavedObj)) {
      const value = unsavedObj[key]

      if (key === "commandChannelIDs") {
        if (
          !arraysAreEqual(unsavedObj[key].sort(), savedChannels[key].sort())
        ) {
          setShowModal(true)
          return
        }
      } else if (value !== savedChannels[key]) {
        setShowModal(true)
        return
      }

      setShowModal(false)
    }
  }

  const handleSave = () => {
    setShowSaveSpinner(true)

    setGuildChannels(unsavedChannels, router.query.serverId).then(
      async (res) => {
        const { success, message } = await res.json()

        if (success) {
          setSavedChannels(unsavedChannels)
          setSaveError(null)
          setShowModal(false)
        } else {
          setSaveError(message)
        }

        setShowSaveSpinner(false)
      }
    )
  }

  return (
    <>
      <NextSeo
        title={`CWStats - ${guild.name} | Channels`}
        description="Customize CW2 Stats Discord bot settings for your server!"
        noindex
        openGraph={{
          title: `CWStats - ${guild.name} | Channels`,
          description:
            "Customize CW2 Stats Discord bot settings for your server!",
        }}
      />
      <ServerHeader name={guild.name} icon={guild.icon} id={guild.guildID} />

      <TabContent>
        <Header>Channels</Header>

        <SingleDiv>
          <ChannelCard
            title="Applications"
            description="The channel where all applications will be posted. Typically this would be a private channel."
            initialChannelID={applicationsChannelID}
            allChannels={channels}
            handleChange={handleChange}
          />
          <ChannelCard
            title="Apply"
            description="The channel where users will be able to apply from using /apply. Typically this would be a public channel."
            initialChannelID={applyChannelID}
            allChannels={channels}
            handleChange={handleChange}
          />
          <ChannelCard
            title="War Report"
            description="The channel where all war reports will be posted by the bot. Typically this would be a quiet channel."
            initialChannelID={reportChannelID}
            allChannels={channels}
            handleChange={handleChange}
          />
        </SingleDiv>

        <ChannelCard
          title="Commands"
          description="The channel(s) where commands are allowed to be used. By default, commands are allowed in every channel."
          activeChannelIDs={unsavedChannels.commandChannelIDs}
          allChannels={channels}
          handleChange={handleChange}
          marginTop="2rem"
        />
      </TabContent>

      <UnsavedChangesModal
        isOpen={showModal}
        onSave={handleSave}
        isLoading={showSaveSpinner}
        error={saveError}
      />
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
      fetchGuildChannels(serverId),
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
      .sort((a, b) => a.name.localeCompare(b.name))

    textChannels.unshift({ name: "None" })

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
    console.log(err)
    return redirect("/500")
  }
}
