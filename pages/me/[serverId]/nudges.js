import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import { useState } from "react"
import { BiPlus } from "react-icons/bi"
import styled from "styled-components"

import Hr from "../../../components/Hr"
import Checkbox from "../../../components/Me/Server/Content/Nudges/Checkbox"
import CustomMessage from "../../../components/Me/Server/Content/Nudges/CustomMessage"
import LinkAccountForm from "../../../components/Me/Server/Content/Nudges/LinkAccountForm"
import ScheduledNudges from "../../../components/Me/Server/Content/Nudges/ScheduledNudges"
import TabContent from "../../../components/Me/Server/Content/TabContent"
import ServerHeader from "../../../components/Me/Server/Header"
import ScheduledNudgeFormModal from "../../../components/Modals/ScheduledNudgeForm"
import UnsavedChangesModal from "../../../components/Modals/UnsavedChangesModal"
import LinkedAccountsTable from "../../../components/Tables/LinkedAccounts"
import clientPromise from "../../../lib/mongodb"
import { gray, orange, pink } from "../../../public/static/colors"
import { redirect } from "../../../utils/functions"
import { fetchGuildChannels, fetchGuilds, updateNudgeSettings } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-bottom: 1rem;
  font-size: 1.8rem;
`

const SubHeader = styled.h3`
  color: ${gray["0"]};
  margin: 1rem 0;
`

const AddScheduledNudge = styled.button`
  margin-top: 1rem;
  background-color: ${pink};
  color: ${gray["0"]};
  font-weight: 700;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: ${orange};
  }
`

const Plus = styled(BiPlus)`
  font-size: 1.25rem;
`

const LinksRemaining = styled.p`
  color: ${gray["0"]};
  margin-top: 1rem;
  text-align: right;
`

export default function ServerPage({ guild, channels, nudges, ignoreLeaders, message, links }) {
  const router = useRouter()
  const [showScheduledNudgeModal, setShowScheduledNudgeModal] = useState(false)
  const [scheduledNudges, setScheduledNudges] = useState(nudges)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showSaveSpinner, setShowSaveSpinner] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [savedSettings, setSavedSettings] = useState({
    ignoreLeaders,
    message: message || "",
  })
  const [unsavedSettings, setUnsavedSettings] = useState({
    ignoreLeaders,
    message: message || "",
  })
  const [linkedAccounts, setLinkedAccounts] = useState(links)

  const handleMessageChange = (e) => {
    setUnsavedSettings({
      ...unsavedSettings,
      message: e.target.value || "",
    })

    setShowSaveModal(e.target.value !== savedSettings.message)
  }

  const handleCheckboxChange = (e) => {
    setUnsavedSettings({
      ...unsavedSettings,
      ignoreLeaders: e.target.checked,
    })

    setShowSaveModal(e.target.checked !== savedSettings.ignoreLeaders)
  }

  const handleSave = async () => {
    setShowSaveSpinner(true)

    const resp = await updateNudgeSettings({
      serverId: router.query.serverId,
      ...unsavedSettings,
    })
    const { success, message: errMessage } = await resp.json()

    if (success) {
      setSavedSettings(unsavedSettings)
      setSaveError(null)
      setShowSaveModal(false)
    } else {
      setSaveError(errMessage)
    }

    setShowSaveSpinner(false)
  }

  return (
    <>
      <NextSeo
        title={`CWStats - ${guild.name} | Nudges`}
        description="Customize CW2 Stats Discord bot settings for your server!"
        noindex
        openGraph={{
          title: `CWStats - ${guild.name} | Nudges`,
          description: "Customize CW2 Stats Discord bot settings for your server!",
        }}
      />
      <ServerHeader name={guild.name} icon={guild.icon} id={guild.guildID} />

      <TabContent>
        <Header>Settings</Header>
        <Checkbox isChecked={unsavedSettings.ignoreLeaders} handleCheckboxChange={handleCheckboxChange} />
        <SubHeader>Custom Message</SubHeader>
        <CustomMessage value={unsavedSettings.message} handleChange={handleMessageChange} />

        <Hr color={gray["50"]} margin="1.5rem 0" />

        <Header>Scheduled Nudges</Header>
        <ScheduledNudges nudges={scheduledNudges} setNudges={setScheduledNudges} channels={channels} />

        {scheduledNudges.length < 5 && (
          <AddScheduledNudge onClick={() => setShowScheduledNudgeModal(true)}>
            <Plus />
          </AddScheduledNudge>
        )}

        <Hr color={gray["50"]} margin="1.5rem 0" />

        <Header>Linked Accounts</Header>
        <LinkAccountForm accounts={linkedAccounts} setAccounts={setLinkedAccounts} />
        <LinksRemaining>
          {linkedAccounts.length}/300
          <span style={{ color: gray["25"] }}> Accounts Linked</span>
        </LinksRemaining>
        <LinkedAccountsTable accounts={linkedAccounts} setAccounts={setLinkedAccounts} />
      </TabContent>

      <ScheduledNudgeFormModal
        isOpen={showScheduledNudgeModal}
        setIsOpen={setShowScheduledNudgeModal}
        channels={channels}
        setScheduledNudges={setScheduledNudges}
        scheduledNudges={scheduledNudges}
      />

      <UnsavedChangesModal isOpen={showSaveModal} onSave={handleSave} isLoading={showSaveSpinner} error={saveError} />
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

    if (!session) return redirect(`/login?callback=${serverId}/nudges`)

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

    const [guildsData, channelsData] = await Promise.all([guildsRes.json(), channelsRes.json()])

    const textChannels = channelsData
      .filter((c) => c.type === 0)
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))

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
          }),
        ),
        channels: textChannels,
        nudges: guild?.nudges?.scheduled || [],
        ignoreLeaders: !!guild?.nudges?.ignoreLeaders,
        message: guild?.nudges?.message || null,
        links: guild?.nudges?.links || [],
      },
    }
  } catch (err) {
    return redirect("/500")
  }
}
