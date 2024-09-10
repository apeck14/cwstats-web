"use client"

import { ActionIcon, Container, Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteDefaultClan, setAdminRole } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"
import SaveSettingsDialog from "../save-settings-dialog"
import AbbreviationsTable from "./abbreviations-table"
import RoleDropdown from "./role-dropdown"
import SetDefaultClanModal from "./set-default-clan-modal"

export default function HomeContent({ guild, roles }) {
  const [saveModalOpened, savedModalHandlers] = useDisclosure(false)
  const [defClan, setDefClan] = useState(guild?.defaultClan)
  const [savedRoleID, setSavedRoleID] = useState(guild?.adminRoleID)
  const [unsavedRoleID, setUnsavedRoleID] = useState(guild?.adminRoleID)

  const handleDefaultClanDelete = () => {
    setDefClan(null)
    deleteDefaultClan(guild.guildID)
  }

  const handleRoleChange = (newRoleID) => {
    setUnsavedRoleID(newRoleID)

    if (savedRoleID === newRoleID) savedModalHandlers.close()
    else savedModalHandlers.open()
  }

  const handleModalSave = () => {
    savedModalHandlers.close()
    setSavedRoleID(unsavedRoleID)

    setAdminRole(guild.guildID, unsavedRoleID)
  }

  return (
    <>
      <Container py="xl" size="lg">
        <Stack gap="3.25rem">
          <Stack>
            <Group gap="xs">
              <Title size="h3">Admin Role</Title>
              <InfoPopover text="Anyone with this role will be able to use Admin Commands like /nudge." />
            </Group>

            <RoleDropdown initialId={unsavedRoleID} label="" noneAsOption roles={roles} setRole={handleRoleChange} />
          </Stack>
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

          <AbbreviationsTable data={guild.abbreviations} id={guild.guildID} />
        </Stack>
      </Container>
      <SaveSettingsDialog isOpen={saveModalOpened} onClose={savedModalHandlers.close} onSave={handleModalSave} />
    </>
  )
}
