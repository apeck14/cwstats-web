"use client"

import { Group, Stack, Table, Text } from "@mantine/core"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { formatRole, getArenaFileName, getLastSeenColor, parseDate, relativeDateStr } from "../../lib/functions"
import Image from "../ui/image"
import classes from "./clan.module.css"

const roles = ["Leader", "Co-Leader", "Elder", "Member"]

const columns = {
  lastSeen: {
    asc: (a, b) => a.lastSeen - b.lastSeen,
    dsc: (a, b) => b.lastSeen - a.lastSeen,
  },
  level: {
    asc: (a, b) => a.level - b.level,
    dsc: (a, b) => b.level - a.level,
  },
  name: {
    asc: (a, b) => b.name.localeCompare(a.name),
    dsc: (a, b) => a.name.localeCompare(b.name),
  },
  rank: {
    asc: (a, b) => b.rank - a.rank,
    dsc: (a, b) => a.rank - b.rank,
  },
  role: {
    asc: (a, b) => roles.indexOf(b.role) - roles.indexOf(a.role),
    dsc: (a, b) => roles.indexOf(a.role) - roles.indexOf(b.role),
  },
  trophies: {
    asc: (a, b) => a.trophies - b.trophies,
    dsc: (a, b) => b.trophies - a.trophies,
  },
}

export default function MembersTable({ members }) {
  const [sortConfig, setSortConfig] = useState({
    col: "rank",
    dir: "dsc",
  })

  const mappedMembers = useMemo(
    () =>
      members.map((m) => {
        const lastSeen = m.lastSeen ? parseDate(m.lastSeen) : new Date()
        return {
          arena: getArenaFileName(m?.arena?.name),
          lastSeen,
          lastSeenColor: getLastSeenColor(lastSeen),
          lastSeenStr: relativeDateStr(lastSeen, false),
          level: m.expLevel,
          name: m.name,
          rank: m.clanRank,
          role: formatRole(m.role),
          tag: m.tag,
          trophies: m.trophies,
        }
      }),
    [],
  )

  const handleThClick = (col) => {
    const sameCol = col === sortConfig.col

    setSortConfig({
      col,
      dir: sameCol ? (sortConfig.dir === "asc" ? "dsc" : "asc") : "dsc",
    })
  }

  const rows = useMemo(
    () =>
      mappedMembers.sort(columns[sortConfig.col][sortConfig.dir]).map((m) => (
        <Table.Tr fw={500} fz="0.85rem">
          <Table.Td ta="center">{m.rank}</Table.Td>
          <Table.Td>
            <Image height={32} src={`/assets/arenas/${m.arena}.png`} />
          </Table.Td>
          <Table.Td ta="center">{m.trophies}</Table.Td>
          <Table.Td visibleFrom="md">
            <Link className="pinkText" href={`/player/${m.tag}`}>
              {m.name}
            </Link>
          </Table.Td>
          {/* mobile player name cell */}
          <Table.Td hiddenFrom="md">
            <Stack gap={0}>
              <Link className="pinkText" href={`/player/${m.tag}`}>
                <Text fw={600} fz="0.9rem">
                  {m.name}
                </Text>
              </Link>
              <Group gap="sm">
                <Text c="gray.1" size="xs">
                  {m.role}
                </Text>
                <Text c={m.lastSeenColor} size="xs">
                  {m.lastSeenStr}
                </Text>
              </Group>
            </Stack>
          </Table.Td>
          {/*  */}
          <Table.Td c={m.lastSeenColor} ta="center" visibleFrom="md">
            {m.lastSeenStr}
          </Table.Td>
          <Table.Td ta="center" visibleFrom="md">
            {m.role}
          </Table.Td>
          <Table.Td ta="center">{m.level}</Table.Td>
        </Table.Tr>
      )),
    [sortConfig],
  )

  const showCaret = (col) => {
    if (sortConfig.col === col) {
      if (sortConfig.dir === "asc") return <IconCaretUpFilled size="1rem" />
      return <IconCaretDownFilled size="1rem" />
    }

    return null
  }

  return (
    <Table className="ignoreContainerPadding" highlightOnHover mt="xs" striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={classes.th} onClick={() => handleThClick("rank")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem">
                #
              </Text>
              {showCaret("rank")}
            </Group>
          </Table.Th>
          <Table.Th style={{ borderBottom: "2px solid var(--mantine-color-pink-6)" }} />
          <Table.Th className={classes.th} onClick={() => handleThClick("trophies")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem" visibleFrom="md">
                Trophies
              </Text>
              <Image height={16} hiddenFrom="md" src="/assets/icons/trophy.png" />
              {showCaret("trophies")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("name")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem">
                Name
              </Text>
              {showCaret("name")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("lastSeen")} ta="center" visibleFrom="md">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem">
                Last Seen
              </Text>
              {showCaret("lastSeen")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("role")} ta="center" visibleFrom="md">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem">
                Role
              </Text>
              {showCaret("role")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("level")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem" visibleFrom="md">
                Level
              </Text>
              <Image height={16} hiddenFrom="md" src="/assets/icons/level.png" />
              {showCaret("level")}
            </Group>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
