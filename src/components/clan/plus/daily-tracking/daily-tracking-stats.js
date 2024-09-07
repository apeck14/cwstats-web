import { Card, Group, SimpleGrid, Text } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react"

const formatNum = (num) => {
  if (Number.isInteger(num)) return num
  return num.toFixed(1)
}

export default function DailyTrackingStats({ stats }) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 5, md: 3 }}>
      {["AVG. FAME", "MEDIAN SCORE", "DAILY FAME", "BATTLES MISSED", "PLAYERS MISSED"].map((l) => {
        const s = stats.find((s) => s.label === l)

        let changeGroup

        // not using percentages (+/- instead)
        if (l.includes("MISSED")) {
          const diff = s.thisWeek - s.lastWeek
          const color = diff > 0 ? "red" : "green"
          const showMinusOnly = !s.lastWeek || diff === 0

          if (showMinusOnly) changeGroup = <IconMinus color="var(--mantine-color-gray-5)" size="0.9rem" />
          else
            changeGroup = (
              <Text c={color} fw="600" fz="0.9rem">
                {diff > 0 ? "+" : "-"}
                {diff}
              </Text>
            )
        } else {
          // using percentages
          const percChange = !s.lastWeek ? 0 : ((s.thisWeek - s.lastWeek) / s.lastWeek) * 100
          const showMinusOnly = !s.lastWeek

          if (showMinusOnly) changeGroup = <IconMinus color="var(--mantine-color-gray-5)" size="0.9rem" />
          else {
            const color = percChange === 0 ? "gray.5" : percChange > 0 ? "green" : "red"
            const percIcon =
              percChange === 0 ? (
                ""
              ) : percChange > 0 ? (
                <IconArrowUpRight size="0.9rem" />
              ) : (
                <IconArrowDownRight size="0.9rem" />
              )

            changeGroup = (
              <Group c={color} gap="0">
                <Text fw="600" fz="0.9rem">
                  {percChange.toFixed(0)}%
                </Text>
                {percIcon}
              </Group>
            )
          }
        }

        return (
          <Card bd="1px solid var(--mantine-color-gray-8)" bg="gray.10" key={s.label}>
            <Text c="dimmed" fw="700" fz="0.9rem">
              {s.label}
            </Text>
            <Group>
              <Text fw="700" fz="1.5rem">
                {formatNum(s.thisWeek)}
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
