"use client"

import { ActionIcon, Group, Stack, Table, Text, Title } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteScheduledNudge } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"
import AddNudgeModal from "./add-nudge-modal"
import EditNudgeModal from "./edit-nudge-modal"

export default function ScheduledNudges({ channels, guild, limit }) {
  const { guildID, nudges } = guild

  const [scheduledNudges, setScheduledNudges] = useState(nudges?.scheduled || [])

  const handleDelete = (tag, hourUTC) => {
    setScheduledNudges(scheduledNudges.filter((a) => a.clanTag !== tag || a.scheduledHourUTC !== hourUTC))
    deleteScheduledNudge(guildID, tag, hourUTC)
  }

  const handleAdd = (nudge) => {
    setScheduledNudges([...scheduledNudges, nudge])
  }

  const handleEdit = (oldNudge, newNudge) => {
    const newNudges = [
      ...scheduledNudges.filter(
        (n) => n.clanTag !== oldNudge.clanTag || n.scheduledHourUTC !== oldNudge.scheduledHourUTC,
      ),
      newNudge,
    ]

    setScheduledNudges(newNudges)
  }

  const rows = scheduledNudges
    .sort((a, b) => {
      if (a.scheduledHourUTC === b.scheduledHourUTC) return a.clanName.localeCompare(b.clanName)
      return a.scheduledHourUTC - b.scheduledHourUTC
    })
    .map((a) => {
      const hour = parseInt(a.scheduledHourUTC)
      const now = new Date()
      const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0))
      const timeStr = utcDate.toLocaleString("en", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
      const channelName = channels.find((c) => c.id === a.channelID)?.name || "deleted-channel"

      return (
        <Table.Tr key={`${a.clanTag}-${a.scheduledHourUTC}`}>
          <Table.Td>{a.clanName}</Table.Td>
          <Table.Td c="gray.1" visibleFrom="md">
            {a.clanTag}
          </Table.Td>
          <Table.Td c="gray.1">{timeStr}</Table.Td>
          <Table.Td c="gray.1">#{channelName}</Table.Td>
          <Table.Td>
            <Group gap="xs" justify="flex-end" py="0.1rem">
              <EditNudgeModal channels={channels} id={guildID} nudge={a} onEdit={handleEdit} />
              <ActionIcon
                aria-label="Delete Scheduled Nudge"
                color="orange"
                onClick={() => handleDelete(a.clanTag, a.scheduledHourUTC)}
                variant="filled"
              >
                <IconTrash size="1.25rem" />
              </ActionIcon>
            </Group>
          </Table.Td>
        </Table.Tr>
      )
    })

  return (
    <Stack mih="12rem">
      <Group justify="space-between" mt="md">
        <Group>
          <Title size="h3">Scheduled Nudges</Title>
          <InfoPopover text="Scheduled Nudges are automated messages posted on Discord to ping users with remaining attacks. Players MUST be linked so the bot knows who to ping." />
        </Group>

        <AddNudgeModal channels={channels} disabled={scheduledNudges.length >= limit} id={guildID} onAdd={handleAdd} />
      </Group>

      <Group gap="0.25rem" justify="flex-end" mt="-0.75rem">
        <Text c="dimmed" fw="600">
          {scheduledNudges.length} / {limit}
        </Text>
        <InfoPopover text="Default nudge limit is 3. Each plus clan linked to your server adds an additional 2." />
      </Group>

      <Table className="ignoreContainerPadding" mt="0.1rem" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Clan</Table.Th>
            <Table.Th visibleFrom="md">Tag</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Channel</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  )
}
