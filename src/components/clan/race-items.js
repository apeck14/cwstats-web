"use client"

import { Group, Paper, Progress, Stack, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

import { getClanBadgeFileName } from "../../lib/functions/utils"
import Image from "../ui/image"
import classes from "./clan.module.css"
import RankIcon from "./rank-icon"

export default function RaceItems({ clans, isColosseum }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const maxFame = isColosseum ? 180000 : 45000

  const badgeSize = isMobile ? 24 : 30
  const iconSize = isMobile ? 16 : 24
  const itemGap = isMobile ? "0.25rem" : "xs"

  return (
    <Stack my="xl">
      {clans.map((c) => {
        const famePerc = (c.fame / maxFame) * 100
        const projPerc = (c.projFame / maxFame) * 100 - famePerc

        return (
          <Paper
            bg="gray.8"
            className={classes.raceItem}
            data-active={c?.bestPlace}
            key={c.tag}
            p={{ base: "sm", md: "md" }}
            radius="md"
          >
            <Group wrap="nowrap">
              <RankIcon isFinished={c.crossedFinishLine} place={c.placement} />
              <Stack gap="xs" w="100%">
                <Group justify="space-between">
                  <Group className={classes.nameItem} gap={itemGap}>
                    <Image
                      height={badgeSize}
                      src={`/assets/badges/${getClanBadgeFileName(c.badgeId, c.trophies)}.png`}
                    />
                    <Text fw={{ base: 600, md: 700 }} fz={{ base: "sm", md: "lg" }}>
                      {c.name}
                    </Text>
                  </Group>
                  <Group className={classes.topItem} gap="xs" visibleFrom="md">
                    <Text fw={600}>{c.trophies}</Text>
                    <Image height={iconSize} src="/assets/icons/cw-trophy.png" />
                  </Group>
                  <Group className={classes.topItem} gap={itemGap}>
                    <Text fw={600} fz={{ base: "xs", md: "md", sm: "sm" }}>
                      {c.boatPoints}
                    </Text>
                    <Image height={iconSize} src="/assets/icons/boat-movement.png" />
                  </Group>
                  <Group gap={itemGap}>
                    <Text fw={600} fz={{ base: "xs", md: "md", sm: "sm" }}>
                      138888
                    </Text>
                    <Image height={iconSize} src="/assets/icons/fame.png" />
                  </Group>
                </Group>
                {!c.crossedFinishLine && (
                  <Group gap={isMobile ? "xs" : "md"}>
                    <Progress.Root className={classes.topItem} size={isMobile ? "lg" : "xl"}>
                      <Progress.Section color="pink" value={famePerc} />
                      <Progress.Section color="orange.4" value={projPerc} />
                    </Progress.Root>
                    <Paper
                      fw={700}
                      fz={{ base: "xs", md: "md" }}
                      p={{ base: "0.1rem", md: "0.15rem" }}
                      ta="center"
                      w={{ base: "3.5rem", md: "5rem" }}
                    >
                      {c.fameAvg.toFixed(2)}
                    </Paper>
                  </Group>
                )}
              </Stack>
            </Group>
          </Paper>
        )
      })}
    </Stack>
  )
}
