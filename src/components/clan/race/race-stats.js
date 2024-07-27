import { Group, NumberFormatter, Paper, SimpleGrid, Text } from "@mantine/core"

import RaceRing from "./race-ring"

const colors = ["green", "lime.4", "yellow", "orange", "red"]

export default function RaceStats({ clan, isColosseum }) {
  const maxPossibleFame = isColosseum ? 180000 : 45000
  const minPossibleFame = isColosseum ? 80000 : 20000

  const data = [
    {
      color: colors[parseInt(clan.projPlace[0]) - 1],
      label: "Projected Finish",
      score: clan.projFame,
      text: clan.projPlace,
      value: Math.max(0, ((clan.projFame - minPossibleFame) / (maxPossibleFame - minPossibleFame)) * 100),
    },
    {
      color: colors[parseInt(clan.bestPlace[0] - 1)],
      label: "Best Possible Finish",
      score: clan.maxFame,
      text: clan.bestPlace,
      value: Math.max(0, ((clan.maxFame - minPossibleFame) / (maxPossibleFame - minPossibleFame)) * 100),
    },
    {
      color: colors[parseInt(clan.worstPlace[0] - 1)],
      label: "Worst Possible Finish",
      score: clan.minFame,
      text: clan.worstPlace,
      value: Math.max(0, ((clan.minFame - minPossibleFame) / (maxPossibleFame - minPossibleFame)) * 100),
    },
  ]

  const stats = data.map((stat) => (
    <Paper key={stat.label} p="xs" radius="md">
      <Group wrap="nowrap">
        <RaceRing stat={stat} />

        <div>
          <Text c="dimmed" fw={700} size="sm" tt="uppercase">
            {stat.label}
          </Text>
          <Text fw={700} size="xl">
            <NumberFormatter thousandSeparator value={stat.score} />
          </Text>
        </div>
      </Group>
    </Paper>
  ))

  return (
    <>
      <Group grow>
        <Paper p="xs" radius="md">
          <Group justify="space-between" wrap="nowrap">
            <Text c="dimmed" fw={700} size="sm">
              BATTLES LEFT
            </Text>
            <Text fw={700} size="xl">
              {clan.battlesRemaining}
            </Text>
          </Group>
        </Paper>
        <Paper p="xs" radius="md">
          <Group justify="space-between">
            <Text c="dimmed" fw={700} size="sm">
              DUELS LEFT
            </Text>
            <Text fw={700} size="xl">
              {clan.duelsRemaining}
            </Text>
          </Group>
        </Paper>
      </Group>
      <SimpleGrid cols={{ base: 1, md: 3 }}>{stats}</SimpleGrid>
    </>
  )
}
