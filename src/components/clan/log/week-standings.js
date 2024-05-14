import { Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"

import Image from "@/components/ui/image"
import { getClanBadgeFileName } from "@/lib/functions/utils"

import classes from "../clan.module.css"
import RankIcon from "../rank-icon"

export default function WeekStandings({ activeWeek, standings, startTime, tag }) {
  const isMobile = useMediaQuery("(max-width: 30em)")

  return (
    <>
      <Title mt="xl" ta="center">
        Standings
      </Title>

      <Paper bg="gray.10" component={Group} justify="space-between" mb="xs" mt="md" px="md" py="sm" radius="md">
        <Text fw="700" fz={{ base: "0.9rem", md: "1rem" }}>
          Season {activeWeek.season} Week {activeWeek.week + 1}
        </Text>

        <Text fz={{ base: "0.9rem", md: "1rem" }}>
          {startTime.toLocaleString(
            {},
            { day: "numeric", hour: "numeric", minute: "2-digit", month: "numeric", year: "numeric" },
          )}
        </Text>
      </Paper>

      <Stack gap="0.25rem">
        {standings.map((c) => (
          <Paper
            bg={tag === c.tag ? "gray.7" : "transparent"}
            className={classes.clan}
            component={Link}
            href={`/clan/${c.tag.substring(1)}/log`}
            key={c.tag}
            p={{ base: "sm", md: "md" }}
            radius="md"
          >
            <Group justify="space-between">
              <Group gap={isMobile ? "sm" : "xl"} miw={{ base: "10rem", md: "18rem" }}>
                {!isMobile && <RankIcon place={c.rank} />}

                <Group gap={isMobile ? "0.25rem" : "md"}>
                  <Image
                    alt="badge"
                    height={isMobile ? 24 : 32}
                    src={`/assets/badges/${getClanBadgeFileName(c.badgeId, c.clanScore)}.webp`}
                  />
                  <Text fw={700} fz={{ base: "0.8rem", md: "1rem" }}>
                    {c.name}
                  </Text>
                </Group>
              </Group>

              <Group gap={isMobile ? "0.25rem" : "md"} miw={{ base: "4.5rem", md: "6rem" }}>
                <Image alt="Boat Points" height={isMobile ? 16 : 24} src="/assets/icons/boat-movement.webp" />
                <Text fw="600" fz={{ base: "0.8rem", md: "1rem" }}>
                  {c.fame}
                </Text>
              </Group>

              <Group gap={isMobile ? "0.25rem" : "md"} justify="flex-end" miw={{ base: "2.75rem", md: "6.5rem" }}>
                <Group gap="0.2rem">
                  <Text c="gray.2" fw="600" fz={{ base: "0.8rem", md: "0.9rem" }}>
                    {c.trophyChange > 0 && "+"}
                    {c.trophyChange}
                  </Text>
                  {!isMobile && (
                    <Text fw="600" fz={{ base: "0.8rem", md: "1rem" }}>
                      {c.clanScore}
                    </Text>
                  )}
                </Group>
                <Image alt="War Trophies" height={isMobile ? 16 : 24} src="/assets/icons/cw-trophy.webp" />
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </>
  )
}
