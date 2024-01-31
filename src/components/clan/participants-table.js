"use client"

import { Group, Table, Text } from "@mantine/core"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import Image from "../ui/image"
import classes from "./clan.module.css"

const columns = {
  boatAttacks: {
    asc: (a, b) => a.boatAttacks - b.boatAttacks,
    dsc: (a, b) => b.boatAttacks - a.boatAttacks,
  },
  decksUsed: {
    asc: (a, b) => a.decksUsed - b.decksUsed,
    dsc: (a, b) => b.decksUsed - a.decksUsed,
  },
  decksUsedToday: {
    asc: (a, b) => b.decksUsedToday - a.decksUsedToday,
    dsc: (a, b) => a.decksUsedToday - b.decksUsedToday,
  },
  fame: {
    asc: (a, b) => a.fame - b.fame,
    dsc: (a, b) => b.fame - a.fame,
  },
  name: {
    asc: (a, b) => b.name.localeCompare(a.name),
    dsc: (a, b) => a.name.localeCompare(b.name),
  },
}

const getShownParticipants = (memberList, participants) => {
  const memberTags = new Set(memberList.map((p) => p.tag))

  const filtered = participants.filter((p) => {
    if (memberTags.has(p.tag)) {
      p.inClan = true
      return true
    }

    return p.fame > 0
  })

  return filtered.sort((a, b) => b.fame - a.fame)
}

export default function ParticipantsTable({ memberList, participants }) {
  const [sortConfig, setSortConfig] = useState({
    col: "fame",
    dir: "dsc",
  })

  const mappedParticipants = useMemo(() => {
    const sortedParticipants = getShownParticipants(memberList, participants)
    return sortedParticipants.map((p, i) => ({ ...p, rank: i + 1 }))
  }, [])

  const handleThClick = (col) => {
    const sameCol = col === sortConfig.col

    setSortConfig({
      col,
      dir: sameCol ? (sortConfig.dir === "asc" ? "dsc" : "asc") : "dsc",
    })
  }

  const rows = useMemo(
    () =>
      mappedParticipants.sort(columns[sortConfig.col][sortConfig.dir]).map((m) => (
        <Table.Tr bg={!m.inClan ? "red.9" : undefined} fw={500} fz={{ base: "0.85rem", md: "0.95rem" }} key={m.tag}>
          <Table.Td ta="center">{m.rank}</Table.Td>
          <Table.Td>
            <Link className="pinkText" href={`/player/${m.tag.substring(1)}`}>
              {m.name}
            </Link>
          </Table.Td>
          <Table.Td ta="center">{m.boatAttacks}</Table.Td>
          <Table.Td ta="center">{m.decksUsed}</Table.Td>
          <Table.Td ta="center">{m.decksUsedToday}</Table.Td>
          <Table.Td ta="center">{m.fame}</Table.Td>
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
    <Table className="ignoreContainerPadding" highlightOnHover my="md" striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ borderBottom: "2px solid var(--mantine-color-pink-6)" }} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }}>
                #
              </Text>
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("name")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }}>
                Player
              </Text>
              {showCaret("name")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("boatAttacks")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }} visibleFrom="md">
                Boat Attacks
              </Text>
              <Image alt="Boat Movement" height={16} hiddenFrom="md" src="/assets/icons/boat-movement.webp" />
              {showCaret("boatAttacks")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("decksUsed")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }} visibleFrom="md">
                Decks Used
              </Text>
              <Image alt="Decks" height={16} hiddenFrom="md" src="/assets/icons/decks.webp" />
              {showCaret("decksUsed")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("decksUsedToday")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }} visibleFrom="md">
                Decks Used Today
              </Text>
              <Image alt="Decks Remaining" height={16} hiddenFrom="md" src="/assets/icons/decksRemaining.webp" />
              {showCaret("decksUsedToday")}
            </Group>
          </Table.Th>
          <Table.Th className={classes.th} onClick={() => handleThClick("fame")} ta="center">
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }} visibleFrom="md">
                Medals
              </Text>
              <Image alt="Fame" height={16} hiddenFrom="md" src="/assets/icons/fame.webp" />
              {showCaret("fame")}
            </Group>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
