import { ActionIcon, Group, Pagination, Stack, Table, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteLinkedAccount } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"

export default function LinkedAccounts({ guildID, limit, linkedAccounts, setLinkedAccounts }) {
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const start = 0 + 50 * (page - 1)
  const end = 50 * page

  const handleDelete = (tag, discordID) => {
    setLinkedAccounts(linkedAccounts.filter((l) => l.tag !== tag || l.discordID !== discordID))
    deleteLinkedAccount(guildID, tag, discordID)
  }

  const rows = linkedAccounts
    .slice(start, end)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((l) => (
      <Table.Tr key={`${l.tag}-${l.discordID}`}>
        <Table.Td>{l.name}</Table.Td>
        <Table.Td c="gray.1" visibleFrom="md">
          {l.tag}
        </Table.Td>
        <Table.Td c="gray.1">{l.discordID}</Table.Td>
        <Table.Td>
          <Group justify="center" py="0.1rem">
            <ActionIcon
              aria-label="Delete Linked Account"
              color="orange"
              onClick={() => handleDelete(l.tag, l.discordID)}
              variant="filled"
            >
              <IconTrash size="1.25rem" />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ))

  return (
    <Stack>
      <Stack align="flex-end" gap="0.2rem">
        <Pagination
          disabled={linkedAccounts.length === 0}
          onChange={setPage}
          size={isMobile ? "xs" : "sm"}
          total={linkedAccounts.length === 0 ? 1 : Math.ceil(linkedAccounts.length / 50)}
          value={page}
        />

        <Group gap="0.25rem">
          <Text c="dimmed" fw="600">
            {linkedAccounts.length} / {limit}
          </Text>
          <InfoPopover text="Default linked player limit is 100. Each plus clan linked to your server adds an additional 75." />
        </Group>
      </Stack>

      <Table className="ignoreContainerPadding" mih="5rem" mt="0.1rem" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Player</Table.Th>
            <Table.Th visibleFrom="md">Tag</Table.Th>
            <Table.Th>Discord ID</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  )
}
