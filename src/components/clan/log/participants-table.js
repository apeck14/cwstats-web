import { Group, Table, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import Image from "@/components/ui/image"

import classes from "../clan.module.css"

const columns = {
  avg: {
    asc: (a, b) => a.avg - b.avg,
    dsc: (a, b) => b.avg - a.avg,
  },
  boatAttacks: {
    asc: (a, b) => a.boatAttacks - b.boatAttacks,
    dsc: (a, b) => b.boatAttacks - a.boatAttacks,
  },
  decksUsed: {
    asc: (a, b) => a.decksUsed - b.decksUsed,
    dsc: (a, b) => b.decksUsed - a.decksUsed,
  },
  fame: {
    asc: (a, b) => b.rank - a.rank,
    dsc: (a, b) => a.rank - b.rank,
  },
  name: {
    asc: (a, b) => b.name.localeCompare(a.name),
    dsc: (a, b) => a.name.localeCompare(b.name),
  },
}

export default function ParticipantsTable({ activeWeek }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const [sortConfig, setSortConfig] = useState({
    col: "fame",
    dir: "dsc",
  })

  const handleThClick = (col) => {
    const sameCol = col === sortConfig.col

    setSortConfig({
      col,
      dir: sameCol ? (sortConfig.dir === "asc" ? "dsc" : "asc") : "dsc",
    })
  }

  const showCaret = (col) => {
    if (sortConfig.col === col) {
      if (sortConfig.dir === "asc") return <IconCaretUpFilled size="1rem" />
      return <IconCaretDownFilled size="1rem" />
    }

    return null
  }

  const rows = useMemo(
    () =>
      activeWeek.participants.sort(columns[sortConfig.col][sortConfig.dir]).map((m) => {
        const formattedTag = m.tag.substring(1)

        return (
          <Table.Tr fw={500} fz={{ base: "0.8rem", md: "1rem" }} key={m.tag}>
            <Table.Td ta="center">{m.rank}</Table.Td>
            <Table.Td>
              <Link className="pinkText" href={`/player/${formattedTag}`}>
                {m.name}
              </Link>
            </Table.Td>
            <Table.Td ta="center">{m.decksUsed}</Table.Td>
            <Table.Td ta="center">{m.boatAttacks}</Table.Td>
            <Table.Td ta="center">{m.avg.toFixed(1)}</Table.Td>
            <Table.Td ta="center">{m.fame}</Table.Td>
          </Table.Tr>
        )
      }),
    [sortConfig, activeWeek],
  )

  const iconSize = isMobile ? 14 : 20

  return (
    <>
      <Title my="lg" ta="center">
        Participants
      </Title>

      <Table className="ignoreContainerPadding" highlightOnHover mt="md" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              fz={{ base: "0.8rem", md: "1rem" }}
              style={{ borderBottom: "2px solid var(--mantine-color-pink-6)" }}
              ta="center"
            >
              #
            </Table.Th>
            <Table.Th className={classes.th} onClick={() => handleThClick("name")}>
              <Group gap="0.2rem">
                <Text fw={700} fz={{ base: "0.8rem", md: "1rem" }}>
                  Players: {activeWeek.participants.length}
                </Text>
                {showCaret("name")}
              </Group>
            </Table.Th>
            <Table.Th className={classes.th} onClick={() => handleThClick("decksUsed")}>
              <Group gap="0.2rem" justify="center">
                <Image alt="Decks Used" height={iconSize} src="/assets/icons/decks.webp" />
                {showCaret("decksUsed")}
              </Group>
            </Table.Th>
            <Table.Th className={classes.th} onClick={() => handleThClick("boatAttacks")}>
              <Group gap="0.2rem" justify="center">
                <Image alt="Boat Attacks" height={iconSize} src="/assets/icons/boat-attack-points.webp" />
                {showCaret("boatAttacks")}
              </Group>
            </Table.Th>
            <Table.Th className={classes.th} onClick={() => handleThClick("avg")} ta="center">
              <Group gap="0.2rem" justify="center">
                <Text fw={700} fz={{ base: "0.8rem", md: "1rem" }}>
                  {activeWeek.avg.toFixed(1)}
                </Text>
                {showCaret("avg")}
              </Group>
            </Table.Th>
            <Table.Th className={classes.th} onClick={() => handleThClick("fame")}>
              <Group gap="0.2rem" justify="center">
                <Image alt="Fame" height={iconSize} src="/assets/icons/fame.webp" />
                {showCaret("fame")}
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  )
}
