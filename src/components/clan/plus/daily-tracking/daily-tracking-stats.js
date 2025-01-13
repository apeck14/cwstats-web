import { Card, Group, SimpleGrid, Text } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react"

import InfoPopover from "@/components/ui/info-popover"

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

const cards = [
  {
    description: "Average fame per attack, grouped by each played day of the week.",
    label: "AVG. FAME",
  },
  {
    description: "Median player score throughout the week.",
    label: "MEDIAN SCORE",
  },
  {
    description: "Average total daily clan fame, grouped by each played day of the week.",
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

export default function DailyTrackingStats({ stats }) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 5, md: 3 }}>
      {cards.map((c) => {
        const s = stats.find((s) => s.label === c.label)

        let changeGroup

        const diff = s.thisWeek - s.lastWeek
        const invertColor = s.label.includes("MISSED")
        const color = diff > 0 ? (invertColor ? "red" : "green") : invertColor ? "green" : "red"
        const showMinusOnly = !s.lastWeek || (diff < 0.05 && diff > -0.05)

        if (showMinusOnly) changeGroup = <IconMinus color="var(--mantine-color-gray-5)" size="0.9rem" />
        else {
          const arrowIcon = diff > 0 ? <IconArrowUpRight size="0.9rem" /> : <IconArrowDownRight size="0.9rem" />

          changeGroup = (
            <Group align="center" c={color} gap="0">
              <Text c={color} fw="600" fz="0.9rem">
                {diff > 0 && "+"}
                {formatNum(diff, s.label)}
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
