import { Card, Group, SimpleGrid, Text } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react"
import { useMemo } from "react"

import InfoPopover from "@/components/ui/info-popover"
import { getAverage, getMedian } from "@/lib/functions/utils"

const formatNum = (num, label) => {
  if (Number.isInteger(num)) return num
  if (!num) return "N/A"

  if (label === "AVG. FAME") return num.toFixed(1)
  if (label === "MEDIAN SCORE") return num.toFixed(1)
  if (label === "DAILY FAME") return num.toFixed(0)
  if (label === "ATTACKS MISSED") return num === 0 ? 0 : num.toFixed(1)
  if (label === "PLAYERS MISSED") return num === 0 ? 0 : num.toFixed(1)

  return ""
}

function getWeekStats(week, data) {
  // calculate each day separately, then the average of that for the weekly average
  // ignore days that don't have any scores
  // if week is an incomplete week, only show AVG FAME & ATTACKS MISSED (minus for all others)
  // if last week is an incomplete week, only compare AVG FAME & ATTACKS MISSED

  const weeks = Object.keys(data)
  const thisWeekIndex = weeks.findIndex((w) => w === week)

  const thisWeek = data[week]
  const lastWeek = data[weeks[thisWeekIndex + 1]] || []

  if (!thisWeek.length) return

  const daysThisWeek = []
  const scoresThisWeek = [] // used to find median score of the week
  let thisWeekIsIncomplete = false

  const daysLastWeek = []
  const scoresLastWeek = []
  let lastWeekIsIncomplete = false

  for (const day of thisWeek) {
    if (!day.scores.length || day.scores.every((p) => p.fame === 0 && !p.missed)) continue

    let totalFame = 0
    let totalAttacks = 0
    let playersCompletedBattles = 0
    let mostAttacksUsed = 0

    const slotsUsed = day.scores.filter((p) => p.attacks).length

    for (const p of day.scores) {
      if (p.attacks) {
        if (p.attacks === 4) playersCompletedBattles++
        if (p.attacks > 4) thisWeekIsIncomplete = true
        if (p.attacks > mostAttacksUsed) mostAttacksUsed = p.attacks
      }
      totalAttacks += p.attacks
      totalFame += p.fame

      if (p.fame || p.missed || (p.fame === 0 && slotsUsed < 50)) scoresThisWeek.push(p.fame)
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
    if (!day.scores.length || day.scores.every((p) => p.fame === 0 && !p.missed)) continue

    let totalFame = 0
    let totalAttacks = 0
    let playersCompletedBattles = 0
    let mostAttacksUsed = 0

    const slotsUsed = day.scores.filter((p) => p.attacks).length

    for (const p of day.scores) {
      if (p.attacks) {
        if (p.attacks === 4) playersCompletedBattles++
        if (p.attacks > 4) lastWeekIsIncomplete = true
        if (p.attacks > mostAttacksUsed) mostAttacksUsed = p.attacks
      }
      totalAttacks += p.attacks
      totalFame += p.fame

      if (p.fame || p.missed || (p.fame === 0 && slotsUsed < 50)) scoresLastWeek.push(p.fame)
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

const cards = [
  {
    description: "Average fame per attack.",
    label: "AVG. FAME",
  },
  {
    description: "Median player score throughout the week.",
    label: "MEDIAN SCORE",
  },
  {
    description: "Average total daily clan fame.",
    label: "DAILY FAME",
  },
  {
    description: "Average daily attacks missed.",
    label: "ATTACKS MISSED",
  },
  {
    description: "Average daily players with missed attacks.",
    label: "PLAYERS MISSED",
  },
]

export default function DailyTrackingStats({ data, week }) {
  const stats = useMemo(() => getWeekStats(week, data), [week])

  return (
    <SimpleGrid cols={{ base: 1, lg: 5, md: 3 }}>
      {cards.map((c) => {
        const s = stats.find((s) => s.label === c.label)

        let changeGroup

        const diff = s.thisWeek - s.lastWeek
        const invertColor = s.label.includes("MISSED")
        const color = diff > 0 ? (invertColor ? "red" : "green") : invertColor ? "green" : "red"
        const showMinusOnly = s.thisWeek === false || s.lastWeek === false || (diff < 0.05 && diff > -0.05)

        if (showMinusOnly) changeGroup = <IconMinus color="var(--mantine-color-gray-5)" size="0.9rem" />
        else {
          const arrowIcon = diff > 0 ? <IconArrowUpRight size="0.9rem" /> : <IconArrowDownRight size="0.9rem" />
          const formattedNum = formatNum(diff, s.label)

          if (s.thisWeek !== false)
            changeGroup = (
              <Group align="center" c={color} gap="0">
                <Text c={color} fw="600" fz="0.9rem">
                  {diff > 0 && "+"}
                  {formattedNum}
                </Text>
                {arrowIcon}
              </Group>
            )
        }

        return (
          <Card bd="1px solid var(--mantine-color-gray-8)" bg="gray.10" key={s.label}>
            <Group justify="space-between">
              <Text c="dimmed" fw="700" fz="0.9rem">
                {s.label}
              </Text>
              <InfoPopover position="top" text={c.description} />
            </Group>

            <Group>
              <Text fw="700" fz="1.5rem">
                {formatNum(s.thisWeek, s.label)}
              </Text>
              {changeGroup}
            </Group>
            <Text c="gray.5" fw="600" fz="xs">
              Compared to previous week
            </Text>
          </Card>
        )
      })}
    </SimpleGrid>
  )
}
