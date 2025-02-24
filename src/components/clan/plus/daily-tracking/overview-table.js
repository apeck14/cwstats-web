import { Group, Stack, Table, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"

import classes from "./daily-tracking.module.css"

const cellColors = [
  "rgb(43, 138, 62, 0.5)", // 225
  "rgb(81, 207, 102, 0.6)", // 200
  "rgb(169, 227, 75, 0.4)", // 175
  "rgb(250, 176, 5, 0.4)", // 150
  "rgb(255, 146, 43, 0.6)", // 125
  "rgb(250, 82, 82, 0.6)", // 100 avg or less than 400 fame
]

function getFameCellColor(avg) {
  const thresholds = [225, 200, 175, 150, 125]
  const index = thresholds.findIndex((t) => avg >= t)

  return cellColors[index === -1 ? 5 : index]
}

function getRowData(data, labels) {
  const playerData = {} // { '#ABC1234': { name, scores: [{ fame: 0, attacks: 0}, null, null, ...] } }

  for (const l of labels) {
    const week = data[l]
    const weekIndex = labels.indexOf(l)

    for (const day of week) {
      for (const s of day.scores) {
        if (!s.attacks) continue

        if (Object.prototype.hasOwnProperty.call(playerData, s.tag)) {
          if (playerData[s.tag].scores[weekIndex]) {
            playerData[s.tag].scores[weekIndex].fame += s.fame
            playerData[s.tag].scores[weekIndex].attacks += s.attacks
          } else {
            playerData[s.tag].scores[weekIndex] = { attacks: s.attacks, fame: s.fame }
          }
        } else {
          const scores = new Array(8).fill(null)
          scores[weekIndex] = { attacks: s.attacks, fame: s.fame }
          playerData[s.tag] = { name: s.name, scores }
        }
      }
    }
  }

  // set averages (4 week and 8 week)
  for (const tag of Object.keys(playerData)) {
    let weekCount = 0
    let totalFame = 0
    let totalAttacks = 0

    for (const w of playerData[tag].scores) {
      if (!w || !w.attacks) continue

      weekCount++
      totalFame += w.fame
      totalAttacks += w.attacks

      if (weekCount === 4) playerData[tag].avg4Weeks = totalAttacks ? totalFame / totalAttacks : 0
    }

    if (!Object.prototype.hasOwnProperty.call(playerData[tag], "avg4Weeks")) {
      playerData[tag].avg4Weeks = totalAttacks ? totalFame / totalAttacks : 0
    }

    playerData[tag].avg8Weeks = totalAttacks ? totalFame / totalAttacks : 0
  }

  return playerData
}

export default function OverviewTable({ data, filterByInClan, labels, memberTags }) {
  const isLessThanTablet = useMediaQuery("(max-width: calc(48em - 1px))")
  const [sortConfig, setSortConfig] = useState({
    col: "avg8Weeks",
    dir: "dsc",
    key: "avg8Weeks",
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
      if (sortConfig.dir === "asc") return <IconCaretUpFilled size={isLessThanTablet ? "0.75rem" : "1rem"} />
      return <IconCaretDownFilled size={isLessThanTablet ? "0.75rem" : "1rem"} />
    }

    return null
  }

  const columns = {
    avg4Weeks: (key, asc) => {
      if (asc) return (a, b) => a[1].avg4Weeks - b[1].avg4Weeks
      return (a, b) => b[1].avg4Weeks - a[1].avg4Weeks
    },
    avg8Weeks: (key, asc) => {
      if (asc) return (a, b) => a[1].avg8Weeks - b[1].avg8Weeks
      return (a, b) => b[1].avg8Weeks - a[1].avg8Weeks
    },
    fame: (key, asc) => {
      const scoreIndex = labels.indexOf(key)
      if (asc) {
        return (a, b) => {
          const fameA = a[1].scores[scoreIndex]?.fame ?? -Infinity
          const fameB = b[1].scores[scoreIndex]?.fame ?? -Infinity
          return fameA - fameB
        }
      }

      return (a, b) => {
        const fameA = a[1].scores[scoreIndex]?.fame ?? -Infinity
        const fameB = b[1].scores[scoreIndex]?.fame ?? -Infinity
        return fameB - fameA
      }
    },
    player: (key, asc) => {
      if (asc) return (a, b) => b[1].name.localeCompare(a[1].name)
      return (a, b) => a[1].name.localeCompare(b[1].name)
    },
  }

  // if < 8 weeks, fill with empty table headers
  const headerLabels = Array.from({ length: 8 }, (_, i) => labels[i] ?? "")
  const headers = useMemo(
    () =>
      headerLabels.slice(0, isLessThanTablet ? 4 : 8).map((w, i) =>
        w ? (
          <Table.Th
            className={isLessThanTablet ? null : classes.hoverableTh}
            key={w}
            onClick={() => handleThClick(w, "fame")}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.6rem", md: "0.8rem" }}>
                {w}
              </Text>
              {showCaret(w)}
            </Group>
          </Table.Th>
        ) : (
          <Table.Th bg="gray.10" key={i} px="0" ta="center" />
        ),
      ),
    [sortConfig, isLessThanTablet],
  )

  const tableData = useMemo(() => getRowData(data, labels), [])

  const rows = useMemo(
    () =>
      Object.entries(tableData)
        .filter(([tag]) => !filterByInClan || (filterByInClan && memberTags.includes(tag)))
        .sort(columns[sortConfig.col](sortConfig.key, sortConfig.dir === "asc"))
        .map(([tag, entry], i) => (
          <Table.Tr fw="600" fz={{ base: "0.65rem", md: "0.85rem" }} key={tag}>
            <Table.Td bg="gray.10" px="0" ta="center">
              {i + 1}
            </Table.Td>
            <Table.Td fz={{ base: "0.65rem", md: "0.9rem" }}>
              <Link className="pinkText" href={`/player/${tag.substring(1)}`} prefetch={false}>
                {entry.name}
              </Link>
            </Table.Td>
            <Table.Td bg={getFameCellColor(entry.avg8Weeks)} ta="center">
              {entry.avg8Weeks.toFixed(1)}
            </Table.Td>
            <Table.Td bg={getFameCellColor(entry.avg4Weeks)} ta="center">
              {entry.avg4Weeks.toFixed(1)}
            </Table.Td>

            {entry.scores.slice(0, isLessThanTablet ? 4 : 8).map((s, i) =>
              s ? (
                <React.Fragment key={`${tag}-${i}`}>
                  <Table.Td ta="center">
                    <Stack gap="0">
                      <Text fz={{ base: "0.65rem", md: "0.85rem" }}>{s.fame}</Text>
                      <Text fz={{ base: "0.65rem", md: "0.85rem" }}>({s.attacks})</Text>
                    </Stack>
                  </Table.Td>
                </React.Fragment>
              ) : (
                <Table.Td key={`${tag}-${i}`} />
              ),
            )}
          </Table.Tr>
        )),
    [sortConfig, isLessThanTablet, filterByInClan],
  )

  return (
    <Table className="ignoreContainerPadding" highlightOnHover layout="fixed" mt="md" striped withColumnBorders>
      <Table.Thead fz={{ base: "0.65rem", md: "0.9rem" }}>
        <Table.Tr>
          <Table.Th bg="gray.10" px="0" ta="center" w={{ base: "1.25rem", md: "2.5rem" }}>
            #
          </Table.Th>
          <Table.Th
            className={isLessThanTablet ? null : classes.hoverableTh}
            onClick={() => handleThClick("player")}
            ta="center"
            w={{ base: "5.5rem", lg: "20%", md: "10rem" }}
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.6rem", md: "0.8rem" }}>
                Player
              </Text>
              {showCaret("player")}
            </Group>
          </Table.Th>
          <Table.Th
            className={isLessThanTablet ? null : classes.hoverableTh}
            onClick={() => handleThClick("avg8Weeks")}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.6rem", md: "0.8rem" }}>
                8 Weeks
              </Text>
              {showCaret("avg8Weeks")}
            </Group>
          </Table.Th>
          <Table.Th
            className={isLessThanTablet ? null : classes.hoverableTh}
            onClick={() => handleThClick("avg4Weeks")}
            ta="center"
          >
            <Group gap={0} justify="center">
              <Text fw={700} fz={{ base: "0.6rem", md: "0.8rem" }}>
                4 Weeks
              </Text>
              {showCaret("avg4Weeks")}
            </Group>
          </Table.Th>

          {headers}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody fw="500">{rows}</Table.Tbody>
    </Table>
  )
}
