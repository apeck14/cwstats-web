import { Group, Stack, Table, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"

import Image from "@/components/ui/image"

import classes from "./daily-tracking.module.css"

const columns = {
  attacks: (key, asc) => {
    const isTotal = key.includes("total")

    if (isTotal) {
      if (asc) return (a, b) => a.totalAttacks - b.totalAttacks
      return (a, b) => b.totalAttacks - a.totalAttacks
    }

    const dayIndex = Number(key.charAt(3)) - 1

    if (asc)
      return (a, b) => {
        const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
        const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

        if (aAttacks === bAttacks) return bFame - aFame
        return aAttacks - bAttacks
      }
    return (a, b) => {
      const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
      const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

      if (aAttacks === bAttacks) return bFame - aFame
      return bAttacks - aAttacks
    }
  },
  avg: (key, asc) => {
    if (asc)
      return (a, b) => {
        if (a.avg === b.avg) return b.totalAttacks - a.totalAttacks
        return a.avg - b.avg
      }
    return (a, b) => {
      if (a.avg === b.avg) return b.totalAttacks - a.totalAttacks
      return b.avg - a.avg
    }
  },
  fame: (key, asc) => {
    const isTotal = key.includes("total")

    if (isTotal) {
      if (asc) return (a, b) => a.totalFame - b.totalFame
      return (a, b) => b.totalFame - a.totalFame
    }

    const dayIndex = Number(key.charAt(3)) - 1

    if (asc)
      return (a, b) => {
        const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
        const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

        if (aFame === bFame) return bAttacks - aAttacks
        return aFame - bFame
      }
    return (a, b) => {
      const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
      const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

      if (aFame === bFame) return bAttacks - aAttacks
      return bFame - aFame
    }
  },
  player: (key, asc) => {
    if (asc) return (a, b) => b.name.localeCompare(a.name)
    return (a, b) => a.name.localeCompare(b.name)
  },
}

const cellColors = [
  "rgb(43, 138, 62, 0.4)",
  "rgb(81, 207, 102, 0.5)",
  "rgb(169, 227, 75, 0.4)",
  "rgb(250, 176, 5, 0.4)",
  "rgb(255, 146, 43, 0.5)",
  "rgb(250, 82, 82, 0.6)",
]

export default function DailyTrackingTable({ data }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const [sortConfig, setSortConfig] = useState({
    col: "fame",
    dir: "dsc",
    key: "totalFame",
  })

  const handleThClick = (key, col) => {
    const sameKey = key === sortConfig.key

    setSortConfig({
      col: col || key,
      dir: sameKey ? (sortConfig.dir === "asc" ? "dsc" : "asc") : "dsc",
      key,
    })
  }

  const showCaret = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.dir === "asc") return <IconCaretUpFilled size={isMobile ? "0.75rem" : "1rem"} />
      return <IconCaretDownFilled size={isMobile ? "0.75rem" : "1rem"} />
    }

    return null
  }

  const rows = useMemo(
    () =>
      Object.values(data)
        .sort(columns[sortConfig.col](sortConfig.key, sortConfig.dir === "asc"))
        .map((entry, i) => (
          <Table.Tr fw="600" fz={{ base: "0.65rem", md: "0.85rem" }} key={entry.tag}>
            <Table.Td bg="gray.10" px="0" ta="center">
              {i + 1}
            </Table.Td>
            <Table.Td fz={{ base: "0.75rem", md: "0.9rem" }}>
              <Link className="pinkText" href={`/player/${entry.tag.substring(1)}`} prefetch={false}>
                {entry.name}
              </Link>
            </Table.Td>
            {entry.scores.map((s, i) => (
              <React.Fragment key={`${entry.tag}-${i}`}>
                <Table.Td ta="center" visibleFrom="md">
                  {s.attacks}
                </Table.Td>
                <Table.Td bg={cellColors[Math.ceil((900 - s.fame) / 100)]} colSpan={isMobile && 2} ta="center">
                  {isMobile ? (
                    <Stack gap="0">
                      <Text fz={{ base: "0.65rem", md: "0.85rem" }}>{s.fame}</Text>
                      <Text fz={{ base: "0.65rem", md: "0.85rem" }}>({s.attacks})</Text>
                    </Stack>
                  ) : (
                    s.fame
                  )}
                </Table.Td>
              </React.Fragment>
            ))}
            <Table.Td ta="center" visibleFrom="md">
              {entry.avg.toFixed(1)}
            </Table.Td>
            <Table.Td ta="center" visibleFrom="md">
              {entry.totalAttacks}
            </Table.Td>
            <Table.Td colSpan={isMobile && 2} ta="center">
              {isMobile ? (
                <Stack gap="0">
                  <Text fz={{ base: "0.65rem", md: "0.85rem" }}>{entry.totalFame}</Text>
                  <Text fz={{ base: "0.65rem", md: "0.85rem" }}>({entry.totalAttacks})</Text>
                </Stack>
              ) : (
                entry.totalFame
              )}
            </Table.Td>
          </Table.Tr>
        )),
    [sortConfig, isMobile],
  )

  return (
    <Table className="ignoreContainerPadding" highlightOnHover layout="fixed" mt="md" striped withColumnBorders>
      <Table.Thead fz={{ base: "0.65rem", md: "0.9rem" }}>
        <Table.Tr>
          <Table.Th bg="gray.10" px="0" rowSpan={2} ta="center" w={{ base: "1.25rem", md: "2.5rem" }}>
            #
          </Table.Th>
          <Table.Th
            className={isMobile ? null : classes.hoverableTh}
            onClick={() => handleThClick("player")}
            rowSpan={2}
            ta="center"
            w={{ base: "7rem", lg: "20%", md: "10rem" }}
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Player
              </Text>
              {showCaret("player")}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isMobile ? 9 : 10}`}
            colSpan={2}
            onClick={isMobile ? () => handleThClick("day1Fame", "fame") : () => {}}
            px="0"
            rowSpan={isMobile && 2}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Day 1
              </Text>
              {isMobile && showCaret("day1Fame")}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isMobile ? 9 : 10}`}
            colSpan={2}
            onClick={isMobile ? () => handleThClick("day2Fame", "fame") : () => {}}
            px="0"
            rowSpan={isMobile && 2}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Day 2
              </Text>
              {isMobile && showCaret("day2Fame")}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isMobile ? 9 : 10}`}
            colSpan={2}
            onClick={isMobile ? () => handleThClick("day3Fame", "fame") : () => {}}
            px="0"
            rowSpan={isMobile && 2}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Day 3
              </Text>
              {isMobile && showCaret("day3Fame")}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isMobile ? 9 : 10}`}
            colSpan={2}
            onClick={isMobile ? () => handleThClick("day4Fame", "fame") : () => {}}
            px="0"
            rowSpan={isMobile && 2}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Day 4
              </Text>
              {isMobile && showCaret("day4Fame")}
            </Group>
          </Table.Th>
          <Table.Th
            className={classes.hoverableTh}
            onClick={() => handleThClick("avg")}
            rowSpan={2}
            ta="center"
            visibleFrom="md"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz="0.9rem">
                Avg.
              </Text>
              {showCaret("avg")}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isMobile ? 9 : 10}`}
            colSpan={2}
            onClick={isMobile ? () => handleThClick("totalFame", "fame") : () => {}}
            px="0"
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.65rem", md: "0.9rem" }}>
                Total
              </Text>
              {isMobile && showCaret("totalFame")}
            </Group>
          </Table.Th>
        </Table.Tr>
        <Table.Tr className="noselect">
          {[1, 2, 3, 4, "total"].map((d) => {
            const prefix = d === "total" ? d : `day${d}`
            return (
              <React.Fragment key={d}>
                <Table.Th
                  className={classes.hoverableTh}
                  onClick={() => handleThClick(`${prefix}Attacks`, "attacks")}
                  px="0"
                  visibleFrom="md"
                >
                  <Group gap={0} justify="center">
                    <Image alt="Attacks" height="16" src="/assets/icons/decksRemaining.webp" />
                    {showCaret(`${prefix}Attacks`)}
                  </Group>
                </Table.Th>
                <Table.Th
                  className={classes.hoverableTh}
                  onClick={() => handleThClick(`${prefix}Fame`, "fame")}
                  px="0"
                  visibleFrom="md"
                >
                  <Group gap={0} justify="center">
                    <Image alt="Fame" height="16" src="/assets/icons/fame.webp" />
                    {showCaret(`${prefix}Fame`)}
                  </Group>
                </Table.Th>
              </React.Fragment>
            )
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody fw="500">{rows}</Table.Tbody>
    </Table>
  )
}
