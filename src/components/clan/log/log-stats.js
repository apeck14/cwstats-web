"use client"

import { Box, Flex, Group, NumberFormatter, Paper, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core"

import RaceRing from "../race/race-ring"

export default function LogStats({ log }) {
  const { bestColAvg, bestColScore, bestWeekAvg, lastColAvg, lastColScore, logAvg, worstWeekAvg } = log || {}

  const lowestScore = Math.min(worstWeekAvg, logAvg, bestWeekAvg, 100)
  let minPerc = 1

  const avgData = [
    {
      color: "var(--mantine-color-red-6)",
      label: "Worst Avg.",
      perc: Math.max(0, ((worstWeekAvg - lowestScore) / (225 - lowestScore)) * 100) || minPerc++,
      value: worstWeekAvg,
    },
    {
      color: "var(--mantine-color-orange-5)",
      label: "10 Week Avg.",
      perc: Math.max(0, ((logAvg - lowestScore) / (225 - lowestScore)) * 100) || minPerc++,
      value: logAvg,
    },
    {
      color: "var(--mantine-color-pink-6)",
      label: "Best Avg.",
      perc: Math.max(0, ((bestWeekAvg - lowestScore) / (225 - lowestScore)) * 100) || minPerc++,
      value: bestWeekAvg,
    },
  ]

  return (
    <Group mt="md">
      <Paper
        bg="gray.7"
        component={Flex}
        direction="column"
        flex="2"
        h="15rem"
        justify="space-between"
        miw="20rem"
        p="md"
        radius="md"
      >
        <Title size="h3">Fame Averages</Title>
        <Text c="dimmed">Compare averages from the last 10 weeks of races.</Text>
        <Progress.Root my="xl" size="1.5rem" transitionDuration={1000}>
          {avgData.map((s, i) => (
            <Progress.Section color={s.color} key={s.label} value={i > 0 ? s.perc - avgData[i - 1].perc : s.perc} />
          ))}
        </Progress.Root>
        <SimpleGrid cols={3}>
          {avgData.map((s) => (
            <Box key={s.label} style={{ borderBottom: `0.25rem solid ${s.color}` }}>
              <Text c="dimmed" fw={700} fz="xs" tt="uppercase">
                {s.label}
              </Text>

              <Group align="flex-end" gap={0} justify="space-between">
                <Text fw={700}>{s.value.toFixed(2)}</Text>
                <Text c={s.color} fw={700} size="sm">
                  {s.perc.toFixed(1)}%
                </Text>
              </Group>
            </Box>
          ))}
        </SimpleGrid>
      </Paper>

      <Stack component={Flex} direction="column" flex="1">
        <Paper miw="20rem" p="md" radius="md">
          <Group>
            <RaceRing
              stat={{
                color: "var(--mantine-color-pink-6)",
                text: bestColAvg?.toFixed(1) || "N/A",
                value: bestColAvg ? Math.max(0, ((bestColAvg - 100) / (225 - 100)) * 100) : 0,
              }}
            />
            <Stack gap="0">
              <Text c="dimmed" fw={700} size="md">
                BEST COLOSSEUM
              </Text>
              <Text fw={700} size="xl">
                {bestColScore ? <NumberFormatter thousandSeparator value={bestColScore} /> : "N/A"}
              </Text>
            </Stack>
          </Group>
        </Paper>
        <Paper p="md" radius="md">
          <Group>
            <RaceRing
              stat={{
                color: "var(--mantine-color-orange-5)",
                text: lastColAvg?.toFixed(1) || "N/A",
                value: lastColAvg ? Math.max(0, ((lastColAvg - 100) / (225 - 100)) * 100) : 0,
              }}
            />
            <Stack gap="0">
              <Text c="dimmed" fw={700} size="md">
                LAST COLOSSEUM
              </Text>
              <Text fw={700} size="xl">
                {lastColScore ? <NumberFormatter thousandSeparator value={lastColScore} /> : "N/A"}
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Stack>
    </Group>
  )
}
