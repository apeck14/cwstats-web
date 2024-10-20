"use client"

import { ActionIcon, Group, Stack, Table, Text, Title } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { deleteAbbreviation } from "@/actions/server"

import InfoPopover from "../../ui/info-popover"
import AddAbbreviationModal from "./add-abbreviation-modal"

export default function AbbreviationsTable({ data, id }) {
  const [abbreviations, setAbbreviations] = useState(data)

  const handleDelete = (abbr) => {
    setAbbreviations(abbreviations.filter((a) => a.abbr !== abbr))
    deleteAbbreviation(id, abbr)
  }

  const rows = abbreviations
    .sort((a, b) => a.abbr.localeCompare(b.abbr))
    .map((a) => (
      <Table.Tr key={a.tag}>
        <Table.Td fw={600} ta="center" tt="lowercase">
          {a.abbr}
        </Table.Td>
        <Table.Td>{a.name}</Table.Td>
        <Table.Td c="gray.1">{a.tag}</Table.Td>
        <Table.Td>
          <Group justify="center" py="0.1rem">
            <ActionIcon aria-label="Settings" color="orange" onClick={() => handleDelete(a.abbr)} variant="filled">
              <IconTrash size="1.25rem" />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ))

  return (
    <Stack>
      <Group align="flex-start" justify="space-between">
        <Group>
          <Title size="h3">Abbreviations</Title>
          <InfoPopover text="Abbreviations are custom phrases linked to clans that can be used with commands, as opposed to entering full clan tags. Abbreviations are case insensitive." />
        </Group>

        <Stack align="flex-end" gap="0.25rem">
          <AddAbbreviationModal abbreviations={abbreviations} id={id} setAbbreviations={setAbbreviations} />
          <Text c="dimmed" fw="600" size="sm">
            {abbreviations.length} / 20
          </Text>
        </Stack>
      </Group>

      <Table className="ignoreContainerPadding" mt="0.1rem" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center">Abbr.</Table.Th>
            <Table.Th>Clan</Table.Th>
            <Table.Th>Tag</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  )
}
