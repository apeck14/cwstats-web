"use client"

import { ActionIcon, Container, Group, Paper, Popover, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { deleteDefaultClan, deleteWarReport } from "../../../actions/server"
import InfoPopover from "../../ui/info-popover"
import AbbreviationsTable from "./abbreviations-table"
import SetDefaultClanModal from "./set-default-clan-modal"
import SetReportModal from "./set-report-modal"

export default function HomeContent({ channels, guild }) {
  const [opened, { close, open }] = useDisclosure(false)
  const [report, setReport] = useState(guild?.warReport)
  const [defClan, setDefClan] = useState(guild?.defaultClan)

  const handleWarReportDelete = () => {
    setReport(null)
    deleteWarReport(guild.guildID)
  }

  const handleDefaultClanDelete = () => {
    setDefClan(null)
    deleteDefaultClan(guild.guildID)
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
    <Container py="lg" size="lg">
      <Stack gap="md">
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

        <AbbreviationsTable data={guild.abbreviations} id={guild.guildID} />

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
    </Container>
  )
}
