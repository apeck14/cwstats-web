"use client"

import { Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconTrophy } from "@tabler/icons-react"
import { useState } from "react"

import Image from "@/components/ui/image"

import classes from "../clan.module.css"
import ParticipantsTable from "./participants-table"
import WeekStandings from "./week-standings"

export default function LogWeeks({ log, tag }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const [activeWeek, setActiveWeek] = useState({ season: Object.keys(log.seasons).reverse()[0], week: 0 })

  const { seasons } = log

  const handleClick = (weekIndex, season) => {
    setActiveWeek({ season, week: weekIndex })
  }

  const activeWeekData = seasons[activeWeek.season].weeks[activeWeek.week]

  const iconSize = isMobile ? 16 : 20

  return (
    <>
      <Paper component={Stack} mt="md" p={{ base: "sm", md: "md" }} radius="md">
        {Object.keys(seasons)
          .reverse()
          .map((sId) => {
            const { seasonAvg, seasonTrophyGain, weeks } = seasons[sId]

            const seasonTrophyPrefix = seasonTrophyGain > 0 ? "+" : ""
            const seasonTrophyColor = seasonTrophyGain > 0 ? "green" : seasonTrophyGain < 0 ? "red" : ""

            return (
              <Paper bg="gray.8" component={Stack} gap="0.25rem" key={sId} p={{ base: "xs", md: "sm" }} radius="sm">
                <Group justify="space-between" mb="xs">
                  <Title fz={{ base: "0.8rem", md: "1rem" }} miw={{ base: "2.75rem", md: "6.75rem" }}>
                    {isMobile ? "S-" : "Season"} {sId}
                  </Title>
                  <Group justify="center" miw={{ base: "1.25rem", md: "2rem" }}>
                    <IconTrophy size={isMobile ? "0.9rem" : "1rem"} />
                  </Group>
                  <Text
                    c="gray.1"
                    fw="600"
                    fz={{ base: "0.8rem", md: "1rem" }}
                    miw={{ base: "2.5rem", md: "4rem" }}
                    ta="center"
                  >
                    {seasonAvg.toFixed(1)}
                  </Text>
                  <Group fz={{ base: "0.8rem", md: "1rem" }} justify="center" miw={{ base: "3rem", md: "6rem" }}>
                    <Image alt="Boat" height={iconSize} src="/assets/icons/boat-movement.webp" />
                  </Group>
                  <Group
                    fz={{ base: "0.8rem", md: "1rem" }}
                    gap="0.5rem"
                    justify="flex-end"
                    miw={{ base: "3.5rem", md: "5rem" }}
                    mr="0.75rem"
                  >
                    <Text
                      c={seasonTrophyColor}
                      fz={{ base: "0.7rem", md: "1rem" }}
                    >{`${seasonTrophyPrefix}${seasonTrophyGain}`}</Text>
                    <Image alt="Boat" height={iconSize} src="/assets/icons/cw-trophy.webp" />
                  </Group>
                </Group>

                {weeks.map((w, i) => (
                  <Paper
                    bg={i === activeWeek.week && sId === activeWeek.season ? "gray.6" : ""}
                    className={classes.week}
                    component={Group}
                    justify="space-between"
                    key={w.week}
                    onClick={() => handleClick(i, sId)}
                    p="sm"
                    radius="xs"
                  >
                    <Text fw="600" fz={{ base: "0.8rem", md: "1rem" }} miw={{ base: "2rem", md: "6rem" }}>
                      W{w.week}
                    </Text>
                    <Text
                      fw="600"
                      fz={{ base: "0.8rem", md: "1rem" }}
                      miw={{ base: "1.25rem", md: "2rem" }}
                      ta="center"
                    >
                      {w.placement}
                    </Text>
                    <Text
                      c="gray.2"
                      fw="600"
                      fz={{ base: "0.8rem", md: "1rem" }}
                      miw={{ base: "2.5rem", md: "4rem" }}
                      ta="center"
                    >
                      {w.avg.toFixed(1)}
                    </Text>
                    <Text fw="600" fz={{ base: "0.8rem", md: "1rem" }} miw={{ base: "3rem", md: "6rem" }} ta="center">
                      {w.boatPoints}
                    </Text>
                    <Group gap="0.2rem" justify="flex-end" miw={{ base: "3.5rem", md: "5rem" }}>
                      <Text c="gray.2" fw="600" fz={{ base: "0.7rem", md: "1rem" }}>
                        {w.trophies > 0 && "+"}
                        {w.trophies}
                      </Text>
                      <Text fw="600" fz={{ base: "0.8rem", md: "1rem" }}>
                        {w.clanScore}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Paper>
            )
          })}
      </Paper>

      <WeekStandings
        activeWeek={activeWeek}
        standings={activeWeekData.standings}
        startTime={activeWeekData.startTime}
        tag={tag}
      />

      <ParticipantsTable activeWeek={activeWeekData} />
    </>
  )
}
