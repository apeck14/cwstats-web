import { Container, Stack, Title } from "@mantine/core"

import { getClan, getRace } from "../../../../actions/supercell"
import ClanHeader from "../../../../components/clan/header"
import RaceStepper from "../../../../components/clan/race-stepper"
import classes from "./Race.module.css"

const fakeRace = [
  {
    badgeId: 16000144,
    clanScore: 4157,
    fame: 10000,
    name: "PTROYALEKINGS 2",
    periodPoints: 0,
    tag: "#PVRCVY29",
  },
  {
    badgeId: 16000026,
    clanScore: 4155,
    fame: 0,
    name: "huskers",
    periodPoints: 35000,
    tag: "#20QPP90R",
  },
  {
    badgeId: 16000081,
    clanScore: 4187,
    fame: 0,
    name: "gli evasi",
    periodPoints: 35000,
    tag: "#P0GRUY2U",
  },
  {
    badgeId: 16000138,
    clanScore: 4115,
    fame: 0,
    name: "Amo los Gatitos",
    periodPoints: 35100,
    tag: "#YGQ892RY",
  },
  {
    badgeId: 16000133,
    clanScore: 4215,
    fame: 0,
    name: "China 听雨楼",
    periodPoints: 0,
    tag: "#PGVGVLLU",
  },
]

export default async function ClanRace({ params }) {
  const { tag } = params
  const [{ data: clan }, { data: race }] = await Promise.all([getClan(tag, true), getRace(tag, false, true)])

  const noActiveRace = race?.clans?.length === 0
  const selectedClan = race?.clans?.find((c) => c.tag === clan?.tag)
  const dayOfWeek = race?.periodIndex % 7
  const isColosseum = race?.periodType === "colosseum"

  const getShownParticipants = () => {
    if (!selectedClan || !selectedClan?.participants) return []

    const memberTags = new Set(selectedClan.participants.map((p) => p.tag))

    return selectedClan.participants.filter((p) => memberTags.has(p.tag) || p.fame > 0)
  }

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
          </Stack>
        )}
      </Container>
    </>
  )
}
