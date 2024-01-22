import { Container, Group, Stack, Title } from "@mantine/core"

import { getClan, getRace } from "../../../../actions/supercell"
import ClanHeader from "../../../../components/clan/header"
import ParticipantsTable from "../../../../components/clan/participants-table"
import RaceItems from "../../../../components/clan/race-items"
import RaceStats from "../../../../components/clan/race-stats"
import RaceStepper from "../../../../components/clan/race-stepper"
import InfoPopover from "../../../../components/ui/info-popover"
import classes from "./Race.module.css"

export default async function ClanRace({ params }) {
  const { tag } = params
  const [{ data: clan }, { data: race }] = await Promise.all([getClan(tag, true), getRace(tag, false, true)])

  const noActiveRace = race?.clans?.length === 0
  const selectedClan = race?.clans?.find((c) => c.tag === clan?.tag)
  const dayOfWeek = race?.periodIndex % 7
  const isColosseum = race?.periodType === "colosseum"

  return (
    <>
      <ClanHeader clan={clan} />
      <Container size="lg">
        {noActiveRace ? (
          <Title mt="xl" size="h3" ta="center">
            Clan not in an active race.
          </Title>
        ) : (
          <Stack mt="md">
            <Title bg="gray.7" className={classes.raceIndex}>
              {isColosseum ? "Colosseum" : `Week ${++race.sectionIndex}`}
            </Title>
            <RaceStepper
              dayDescriptions={selectedClan.periodLogDescriptions}
              dayOfWeek={dayOfWeek}
              week={++race.sectionIndex}
            />
            <RaceItems clans={race.clans} isColosseum={isColosseum} />
            <Group gap="xs" justify="center">
              <Title>Clan Stats</Title>
              <InfoPopover iconSize="1.25rem" text="All projections assume no missed attacks." />
            </Group>
            <RaceStats clan={selectedClan} isColosseum={isColosseum} />
            <Title mt="xl" ta="center">
              Participants
            </Title>
            <ParticipantsTable memberList={clan.memberList} participants={selectedClan.participants} />
          </Stack>
        )}
      </Container>
    </>
  )
}
