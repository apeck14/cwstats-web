"use client"

import { Group, Select, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCalendarWeek } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { getAverage, getMedian } from "@/lib/functions/utils"

import DailyTrackingStats from "./daily-tracking-stats"
import DailyTrackingTable from "./daily-tracking-table"

function getTableData(data, length, start) {
  const slicedData = data.slice(start, start + length)
  const tableData = {}

  for (let i = 0; i < slicedData.length; i++) {
    const day = slicedData[i]
    const dayIndex = day.day - 1

    for (const entry of day.scores) {
      if (!entry.fame && !entry.missed) continue

      if (entry.tag in tableData) {
        tableData[entry.tag].scores[dayIndex] = { attacks: entry.attacks, fame: entry.fame, missed: entry.missed }
        tableData[entry.tag].totalFame += entry.fame
        tableData[entry.tag].totalAttacks += entry.attacks
      } else {
        const scores = Array(4).fill({ attacks: 0, fame: 0 })

        scores[dayIndex] = { attacks: entry.attacks, fame: entry.fame, missed: entry.missed }

        tableData[entry.tag] = {
          name: entry.name,
          scores,
          tag: entry.tag,
          totalAttacks: entry.attacks,
          totalFame: entry.fame,
        }
      }
    }
  }

  // add avg
  for (const tag of Object.keys(tableData)) {
    const { totalAttacks, totalFame } = tableData[tag]

    tableData[tag].avg = totalAttacks ? totalFame / totalAttacks : 0
  }

  return tableData
}

function getStats(week, data, weekData) {
  // calculate each day separately, then the average of that for the weekly average
  // ignore days that don't have any scores
  // if week is an incomplete week, only show AVG FAME & ATTACKS MISSED (minus for all others)
  // if last week is an incomplete week, only compare AVG FAME & ATTACKS MISSED

  const thisWeekIndex = weekData.findIndex((e) => e.label === week)

  const { length: thisWeekLength, start: thisWeekStart } = weekData[thisWeekIndex] || {}
  const { length: lastWeekLength, start: lastWeekStart } = weekData[thisWeekIndex + 1] || {}

  const thisWeek = data.slice(thisWeekStart, thisWeekStart + thisWeekLength)
  const lastWeek = data.slice(lastWeekStart, lastWeekStart + lastWeekLength)

  if (!thisWeek.length) return

  const daysThisWeek = []
  const scoresThisWeek = [] // used to find median score of the week
  let thisWeekIsIncomplete = false

  const daysLastWeek = []
  const scoresLastWeek = []
  let lastWeekIsIncomplete = false

  for (const day of thisWeek) {
    if (!day.scores.length || day.scores.every((p) => p.fame === 0)) continue

    let totalFame = 0
    let totalAttacks = 0
    let playersCompletedBattles = 0
    let mostAttacksUsed = 0

    for (const p of day.scores) {
      if (p.attacks) {
        if (p.attacks === 4) playersCompletedBattles++
        if (p.attacks > 4) thisWeekIsIncomplete = true
        if (p.attacks > mostAttacksUsed) mostAttacksUsed = p.attacks
      }
      totalAttacks += p.attacks
      totalFame += p.fame

      if (p.fame || p.missed) scoresThisWeek.push(p.fame)
    }

    const daysMergedIntoToday = mostAttacksUsed > 4 ? Math.ceil(mostAttacksUsed / 4) : 1
    const totalExpectedBattles = daysMergedIntoToday * 200 // total battles across all days merged

    daysThisWeek.push({
      "ATTACKS MISSED": totalExpectedBattles - totalAttacks,
      "AVG. FAME": totalAttacks ? totalFame / totalAttacks : 0,
      "DAILY FAME": totalFame,
      "PLAYERS MISSED": 50 - playersCompletedBattles,
    })
  }

  for (const day of lastWeek) {
    if (!day.scores.length || day.scores.every((p) => p.fame === 0)) continue

    let totalFame = 0
    let totalAttacks = 0
    let playersCompletedBattles = 0
    let mostAttacksUsed = 0

    for (const p of day.scores) {
      if (p.attacks) {
        if (p.attacks === 4) playersCompletedBattles++
        if (p.attacks > 4) lastWeekIsIncomplete = true
        if (p.attacks > mostAttacksUsed) mostAttacksUsed = p.attacks
      }
      totalAttacks += p.attacks
      totalFame += p.fame
      if (p.fame || p.missed) scoresLastWeek.push(p.fame)
    }

    const daysMergedIntoToday = mostAttacksUsed > 4 ? Math.ceil(mostAttacksUsed / 4) : 1
    const totalExpectedBattles = daysMergedIntoToday * 200

    daysLastWeek.push({
      "ATTACKS MISSED": totalExpectedBattles - totalAttacks,
      "AVG. FAME": totalAttacks ? totalFame / totalAttacks : 0,
      "DAILY FAME": totalFame,
      "PLAYERS MISSED": 50 - playersCompletedBattles,
    })
  }

  const labels = ["AVG. FAME", "ATTACKS MISSED", "DAILY FAME", "PLAYERS MISSED"]
  const incompleteLabels = ["AVG. FAME", "ATTACKS MISSED"]

  const items = labels.map((l) => {
    const calculateThisWeek = !thisWeekIsIncomplete || (thisWeekIsIncomplete && incompleteLabels.includes(l))
    const calculateLastWeek = !lastWeekIsIncomplete || (lastWeekIsIncomplete && incompleteLabels.includes(l))

    return {
      label: l,
      lastWeek: calculateLastWeek && getAverage(daysLastWeek.map((e) => e[l])),
      thisWeek: calculateThisWeek && getAverage(daysThisWeek.map((e) => e[l])),
    }
  })

  items.push({
    label: "MEDIAN SCORE",
    lastWeek: !lastWeekIsIncomplete && getMedian(scoresLastWeek),
    thisWeek: !thisWeekIsIncomplete && getMedian(scoresThisWeek),
  })

  return items
}

export default function DailyTrackingContent({ data, weekData }) {
  const [week, setWeek] = useState(weekData[0]?.label)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const labels = useMemo(() => weekData.map((e) => e.label), [])

  const { length, start } = weekData.find((w) => w.label === week) || {}
  const tableData = getTableData(data, length, start)
  const stats = getStats(week, data, weekData)

  const handleSelect = (val) => {
    setWeek(val)
  }

  return (
    <>
      <Group gap="xs" justify="center">
        <IconCalendarWeek color="var(--mantine-color-orange-5)" size={isMobile ? "1.5rem" : "2rem"} />
        <Title size={isMobile ? "h2" : "h1"}>Daily Player Tracking</Title>
      </Group>
      {!data.length ? (
        <Text c="gray.3" fw="600" mt="xl" ta="center">
          No data to display yet. Check back soon!
        </Text>
      ) : (
        <Stack>
          <Group justify="flex-end">
            <Select
              allowDeselect={false}
              data={labels}
              maw="9rem"
              mt="md"
              onChange={handleSelect}
              placeholder="Pick value"
              value={week}
            />
          </Group>
          <DailyTrackingStats stats={stats} />
          <DailyTrackingTable data={tableData} week={week} />
          <Text c="dimmed" fs="italic" fz="sm">
            * Striped cells indicate missed attacks
          </Text>
        </Stack>
      )}
    </>
  )
}
