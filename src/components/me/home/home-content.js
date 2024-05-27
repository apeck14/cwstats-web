"use client"

import { ActionIcon, Container, Group, Paper, Popover, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { deleteDefaultClan, deleteWarReport, setAdminRole } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"
import SaveSettingsDialog from "../save-settings-dialog"
import AbbreviationsTable from "./abbreviations-table"
import RoleDropdown from "./role-dropdown"
import SetDefaultClanModal from "./set-default-clan-modal"
import SetReportModal from "./set-report-modal"

export default function HomeContent({ channels, guild, roles }) {
  const [opened, { close, open }] = useDisclosure(false)
  const [saveModalOpened, savedModalHandlers] = useDisclosure(false)
  const [report, setReport] = useState(guild?.warReport)
  const [defClan, setDefClan] = useState(guild?.defaultClan)
  const [savedRoleID, setSavedRoleID] = useState(guild?.adminRoleID)
  const [unsavedRoleID, setUnsavedRoleID] = useState(guild?.adminRoleID)

  const handleWarReportDelete = () => {
    setReport(null)
    deleteWarReport(guild.guildID)
  }

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

  const reportTime = useMemo(() => {
    if (!report) return null

    const hour = parseInt(report.scheduledReportTimeHHMM.substring(0, 2))
    const colonIndex = report.scheduledReportTimeHHMM.indexOf(":")
    const minutes = parseInt(report.scheduledReportTimeHHMM.substring(colonIndex + 1, colonIndex + 3))

    const now = new Date()
    const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minutes))
    const timeStr = utcDate.toLocaleString("en", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    })

    return timeStr
  }, [report])

  return (
    <>
      <Container py="xl" size="lg">
        <Stack gap="3.25rem">
          <Stack>
            <Group gap="xs">
              <Title size="h3">Admin Role</Title>
              <InfoPopover text="Anyone with this role or Manage Server+ permissions can use commands like /nudge and change CWStats settings for your server. However, only members with Manage Server+ can change this role." />
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

          <Stack>
            <Group gap="xs" mt="md">
              <Title size="h3">Daily War Report</Title>
              <InfoPopover text="Schedule a daily war report to be posted in your server at a specific time of each war day." />
            </Group>
            {report ? (
              <>
                <Paper bg="gray.8" component={Group} p="sm" radius="md" w="fit-content">
                  <Text fw={600}>{report.name}</Text>
                  <Text c="gray.1">{reportTime}</Text>
                  <ActionIcon aria-label="Settings" color="orange" onClick={handleWarReportDelete} variant="filled">
                    <IconTrash size="1.25rem" />
                  </ActionIcon>
                </Paper>
                <Popover opened={opened} position="bottom" shadow="md" width={200} withArrow>
                  <Popover.Target>
                    <Text c="gray.1" fz="sm" onMouseEnter={open} onMouseLeave={close} td="underline" w="fit-content">
                      Not seeing your war report?
                    </Text>
                  </Popover.Target>
                  <Popover.Dropdown style={{ pointerEvents: "none" }}>
                    <Text size="xs">
                      Make sure your bot has the necessary permissions to send a message in the set channel. Required
                      Permissions: View Channel, Send Messages, Embed Links, Attach Files, Use External Emoji
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </>
            ) : (
              <SetReportModal channels={channels} id={guild.guildID} setReport={setReport} />
            )}
          </Stack>

          <AbbreviationsTable data={guild.abbreviations} id={guild.guildID} />
        </Stack>
      </Container>
      <SaveSettingsDialog isOpen={saveModalOpened} onClose={savedModalHandlers.close} onSave={handleModalSave} />
    </>
  )
}
