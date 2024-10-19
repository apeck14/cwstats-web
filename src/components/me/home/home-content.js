"use client"

import { ActionIcon, Container, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteDefaultClan, setAdminRole, setGuildChannelData } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"
import ChannelsContent from "../channels/channels-content"
import SaveSettingsDialog from "../save-settings-dialog"
import AbbreviationsTable from "./abbreviations-table"
import RoleDropdown from "./role-dropdown"
import SetDefaultClanModal from "./set-default-clan-modal"

export default function HomeContent({ channels, guild, roles }) {
  const [saveModalOpened, { close, open }] = useDisclosure(false)
  const [defClan, setDefClan] = useState(guild?.defaultClan)
  const [savedRoleID, setSavedRoleID] = useState(guild?.adminRoleID)
  const [unsavedRoleID, setUnsavedRoleID] = useState(guild?.adminRoleID)
  const [savedChannelState, setSavedChannelState] = useState({
    applicationsChannelID: guild?.channels?.applicationsChannelID || "",
    applyChannelID: guild?.channels?.applyChannelID || "",
  })
  const [unsavedChannelState, setUnsavedChannelState] = useState({
    applicationsChannelID: guild?.channels?.applicationsChannelID || "",
    applyChannelID: guild?.channels?.applyChannelID || "",
  })

  const handleDefaultClanDelete = () => {
    setDefClan(null)
    deleteDefaultClan(guild.guildID)
  }

  const handleRoleChange = (newRoleID) => {
    setUnsavedRoleID(newRoleID)

    if (
      savedRoleID === newRoleID &&
      unsavedChannelState.applicationsChannelID === savedChannelState.applicationsChannelID &&
      unsavedChannelState.applyChannelID === savedChannelState.applyChannelID
    )
      close()
    else open()
  }

  const handleModalSave = () => {
    close()
    setSavedRoleID(unsavedRoleID)
    setSavedChannelState(unsavedChannelState)

    setGuildChannelData(guild.guildID, unsavedChannelState)
    setAdminRole(guild.guildID, unsavedRoleID)
  }

  const handleChannelChange = (type, id) => {
    const newUnsavedState = { ...unsavedChannelState }
    newUnsavedState[type] = id === "none" ? "" : id

    setUnsavedChannelState(newUnsavedState)

    if (
      savedRoleID === unsavedRoleID &&
      newUnsavedState.applicationsChannelID === savedChannelState.applicationsChannelID &&
      newUnsavedState.applyChannelID === savedChannelState.applyChannelID
    ) {
      close()
    } else open()
  }

  return (
    <>
      <Container py="xl" size="lg">
        <Stack gap="3rem">
          <Stack>
            <Group gap="xs">
              <Title size="h3">Admin Role</Title>
              <InfoPopover text="Anyone with this role will be able to use Admin Commands like /nudge." />
            </Group>

            <RoleDropdown initialId={unsavedRoleID} label="" noneAsOption roles={roles} setRole={handleRoleChange} />
          </Stack>

          <Divider color="gray.7" size="md" />

          <Stack>
            <Group gap="xs">
              <Title size="h3">Default Clan</Title>
              <InfoPopover text="Setting a default clan enables you to use commands without an abbreviation or clan tag." />
            </Group>

            {defClan ? (
              <Paper bg="gray.8" component={Group} p="sm" radius="md" w="fit-content">
                <Text fw={600}>{defClan.name}</Text>
                <Text c="gray.1" fw={600}>
                  {defClan.tag}
                </Text>
                <ActionIcon aria-label="Settings" color="orange" onClick={handleDefaultClanDelete} variant="filled">
                  <IconTrash size="1.25rem" />
                </ActionIcon>
              </Paper>
            ) : (
              <SetDefaultClanModal id={guild.guildID} setDefClan={setDefClan} />
            )}
          </Stack>

          <Divider color="gray.7" size="md" />

          <AbbreviationsTable data={guild.abbreviations} id={guild.guildID} />

          <Divider color="gray.7" size="md" />

          <ChannelsContent channels={channels} guild={guild} handleChannelChange={handleChannelChange} />
        </Stack>
      </Container>
      <SaveSettingsDialog isOpen={saveModalOpened} onClose={close} onSave={handleModalSave} />
    </>
  )
}
