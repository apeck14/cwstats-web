"use client"

import { Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconHourglassEmpty } from "@tabler/icons-react"
import { useState } from "react"

import HourlyAvgDay from "./hourly-avg-day"
import HourlyAverageGraph from "./hourly-avg-graph"

export default function HourlyAvgContent({ data, initialDay }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const [selectedDay, setselectedDay] = useState(initialDay) // { season: 100, week: 1, day: 2}

  const handleDayClick = (season, week, day) => {
    setselectedDay({ day, season, week })
  }

  return (
    <>
      <Group gap="xs" justify="center" mb="md">
        <IconHourglassEmpty color="var(--mantine-color-orange-6)" size={isMobile ? "1.5rem" : "2rem"} />
        <Title size={isMobile ? "h2" : "h1"}>Hourly Fame Tracking</Title>
      </Group>

      <HourlyAverageGraph allData={data} selectedDay={selectedDay} />

      {!Object.keys(data).length ? (
        <Text c="gray.1" fw="600" fz="xl" mt="5rem" ta="center">
          No data has been tracked yet. Come back soon!
        </Text>
      ) : (
        <Stack my="lg">
          {Object.keys(data)
            .reverse()
            .map((s) => (
              <Paper key={s} p="md">
                <Title size="h3">Season {s}</Title>
                <Stack gap="xs" mt="xs">
                  {Object.keys(data[s])
                    .sort((a, b) => b - a)
                    .map((w) => (
                      <Paper bg="gray.8" key={`${s}-${w}`} p="md">
                        <Title size="h4">Week {w}</Title>
                        <Stack gap="xs" mt="xs">
                          {Object.keys(data[s][w])
                            .sort((a, b) => b - a)
                            .map((d) => (
                              <HourlyAvgDay
                                checked={selectedDay.season === s && selectedDay.week === w && selectedDay.day === d}
                                day={d}
                                handleClick={handleDayClick}
                                key={`${s}-${w}-${d}`}
                                season={s}
                                week={w}
                              />
                            ))}
                        </Stack>
                      </Paper>
                    ))}
                </Stack>
              </Paper>
            ))}
        </Stack>
      )}
    </>
  )
}
