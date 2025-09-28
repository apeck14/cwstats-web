"use client"

import { ActionIcon, Container, Divider, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteDefaultClan, setAdminRole, setGuildChannelData, setGuildTimezone } from "@/actions/server"

import NewText from "../../new-text"
import InfoPopover from "../../ui/info-popover"
import SaveSettingsDialog from "../save-settings-dialog"
import AbbreviationsTable from "./abbreviations-table"
import ChannelsContent from "./channels/channels-content"
import RoleDropdown from "./role-dropdown"
import SetDefaultClanModal from "./set-default-clan-modal"
import TimezoneSelect from "./timezone-dropdown"

export default function HomeContent({ channels, guild, roles }) {
  const [saveModalOpened, { close, open }] = useDisclosure(false)

  // === State ===
  const [defClan, setDefClan] = useState(guild?.defaultClan)
  const [savedRoleID, setSavedRoleID] = useState(guild?.adminRoleID)
  const [unsavedRoleID, setUnsavedRoleID] = useState(guild?.adminRoleID)

  const initialChannelState = {
    applicationsChannelID: guild?.channels?.applicationsChannelID || "",
    applyChannelID: guild?.channels?.applyChannelID || "",
  }

  const [savedChannelState, setSavedChannelState] = useState(initialChannelState)
  const [unsavedChannelState, setUnsavedChannelState] = useState(initialChannelState)

  const [savedTimezone, setSavedTimezone] = useState(guild?.timezone || "")
  const [unsavedTimezone, setUnsavedTimezone] = useState(guild?.timezone || "")

  // Utility to check if any setting has changed to open save modal
  const checkIfSettingsChanged = (roleID, channelState, timezone = unsavedTimezone) => {
    if (
      roleID !== savedRoleID ||
      channelState.applicationsChannelID !== savedChannelState.applicationsChannelID ||
      channelState.applyChannelID !== savedChannelState.applyChannelID ||
      timezone !== savedTimezone
    ) {
      open()
    } else {
      close()
    }
  }

  const handleDefaultClanDelete = () => {
    setDefClan(null)
    deleteDefaultClan(guild.guildID)
  }

  const handleRoleChange = (newRoleID) => {
    setUnsavedRoleID(newRoleID)
    checkIfSettingsChanged(newRoleID, unsavedChannelState)
  }

  const handleModalSave = () => {
    // Admin Role
    if (unsavedRoleID !== savedRoleID) {
      setSavedRoleID(unsavedRoleID)
      setAdminRole(guild.guildID, unsavedRoleID)
    }

    // Channels
    if (
      unsavedChannelState.applicationsChannelID !== savedChannelState.applicationsChannelID ||
      unsavedChannelState.applyChannelID !== savedChannelState.applyChannelID
    ) {
      setSavedChannelState(unsavedChannelState)
      setGuildChannelData(guild.guildID, unsavedChannelState)
    }

    // Timezone
    if (unsavedTimezone !== savedTimezone) {
      setSavedTimezone(unsavedTimezone)

      const formattedTimezone = unsavedTimezone.split(" - ")[0]
      setGuildTimezone(guild.guildID, formattedTimezone)
    }

    // Close modal
    close()
  }

  const handleChannelChange = (type, id) => {
    const newState = { ...unsavedChannelState, [type]: id === "none" ? "" : id }
    setUnsavedChannelState(newState)
    checkIfSettingsChanged(unsavedRoleID, newState)
  }

  const handleTimezoneChange = (timezone) => {
    setUnsavedTimezone(timezone)
    checkIfSettingsChanged(unsavedRoleID, unsavedChannelState, timezone)
  }

  return (
    <>
      <Container py="xl" size="lg">
        <Stack gap="3rem">
          {/* Top grid: Admin Role / Default Clan / Timezone */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
            {/* Admin Role */}
            <Stack>
              <Group gap="xs">
                <Title size="h3">Admin Role</Title>
                <InfoPopover text="Anyone with this role will be able to use Admin Commands like /nudge." />
              </Group>
              <RoleDropdown initialId={unsavedRoleID} label="" noneAsOption roles={roles} setRole={handleRoleChange} />
            </Stack>

            {/* Timezone */}
            <Stack>
              <Title component={Group} gap="xs" size="h3">
                Timezone <NewText />
              </Title>
              <TimezoneSelect setTimezone={handleTimezoneChange} timezone={unsavedTimezone} />
            </Stack>

            {/* Default Clan */}
            <Stack>
              <Group gap="xs">
                <Title size="h3">Default Clan</Title>
                <InfoPopover text="Setting a default clan enables you to use commands without an abbreviation or clan tag." />
              </Group>

              {defClan ? (
                <Paper bg="gray.8" component={Group} p="0.5rem" radius="md" w="fit-content">
                  <Text fw={600}>{defClan.name}</Text>
                  <Text c="gray.1" fw={600}>
                    {defClan.tag}
                  </Text>
                  <ActionIcon aria-label="Delete" color="orange" onClick={handleDefaultClanDelete} variant="filled">
                    <IconTrash size="1.25rem" />
                  </ActionIcon>
                </Paper>
              ) : (
                <SetDefaultClanModal id={guild.guildID} setDefClan={setDefClan} />
              )}
            </Stack>
          </SimpleGrid>

          <Divider color="gray.7" size="md" />

          {/* Abbreviations Table */}
          <AbbreviationsTable data={guild.abbreviations} id={guild.guildID} />

          <Divider color="gray.7" size="md" />

          {/* Channels */}
          <ChannelsContent channels={channels} guild={guild} handleChannelChange={handleChannelChange} />
        </Stack>
      </Container>

      <SaveSettingsDialog isOpen={saveModalOpened} onClose={close} onSave={handleModalSave} />
    </>
  )
}
