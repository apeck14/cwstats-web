import { Container, Group, Stack, Title } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan, getRace } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import ParticipantsTable from "@/components/clan/participants-table"
import RaceItems from "@/components/clan/race/race-items"
import RaceStats from "@/components/clan/race/race-stats"
import RaceStepper from "@/components/clan/race/race-stepper"
import InfoPopover from "@/components/ui/info-popover"
import { getClanBadgeFileName, getSupercellRedirectRoute } from "@/lib/functions/utils"

import classes from "./Race.module.css"

export async function generateMetadata({ params }) {
  const { tag } = params
  const { data: clan } = await getClan(tag)

  if (!clan) return

  return {
    description: clan.description,
    openGraph: {
      images: `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`,
    },
    title: `${clan.name} ${clan.tag} | Race - CWStats`,
  }
}

export const dynamic = "force-dynamic"

export default async function ClanRace({ params }) {
  const { tag } = params
  const [{ data: clan, status: clanStatus }, { data: race, status: raceStatus }] = await Promise.all([
    getClan(tag),
    getRace(tag, true),
  ])

  const noActiveRace = (clanStatus === 200 && raceStatus === 404) || (race && !race?.clans?.length)

  // redirect all errors except when clanStatus = 200, raceStatus = 404 (no active race)
  if (!noActiveRace && (clanStatus !== 200 || raceStatus !== 200)) redirect(getSupercellRedirectRoute(raceStatus))
  else {
    const selectedClan = race?.clans?.find((c) => c.tag === clan?.tag)
    const dayOfWeek = race?.periodIndex % 7
    const isColosseum = race?.periodType === "colosseum"

    const clansBadgeData = race?.clans.map((c) => ({
      badge: getClanBadgeFileName(c.badgeId, c.trophies),
      name: c.name,
      tag: c.tag,
    }))

    return (
      <>
        <ClanHeader clan={clan} />
        <Container size="lg">
          {noActiveRace ? (
            <Title c="gray.1" mt="xl" size="h2" ta="center">
              No active race.
            </Title>
          ) : (
            <Stack mt="md">
              <Title ta="center">River Race</Title>
              <Title bg="gray.7" className={classes.raceIndex}>
                {isColosseum ? "Colosseum" : `Week ${race?.sectionIndex + 1}`}
              </Title>
              <RaceStepper
                clansBadgeData={clansBadgeData}
                dayDescriptions={selectedClan.periodLogDescriptions}
                dayOfWeek={dayOfWeek}
                isColosseum={isColosseum}
                periodLogs={race.periodLogs}
                tag={clan.tag}
              />
              <RaceItems clans={race.clans} isColosseum={isColosseum} />
              <Group gap="xs" justify="center">
                <Title>Clan Stats</Title>
                <InfoPopover iconSize="1.25rem" text="All projections assume remaining attacks get completed." />
              </Group>
              <RaceStats clan={selectedClan} isColosseum={isColosseum} />
              <Group gap="xs" justify="center" mt="xl">
                <Title>Participants</Title>
                <InfoPopover
                  iconSize="1.25rem"
                  text="Collection of weekly player scores. Players highlighted in orange are not currently in the clan."
                />
              </Group>
              <ParticipantsTable memberList={clan.memberList} participants={selectedClan.participants} />
            </Stack>
          )}
        </Container>
      </>
    )
  }
}
