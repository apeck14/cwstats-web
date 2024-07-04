import { Container } from "@mantine/core"

import { getClan } from "@/actions/supercell"
import { getPlusClanData } from "@/actions/upgrade"
import ClanHeader from "@/components/clan/header"
import HourlyAvgContent from "@/components/clan/plus/hourly-avg-content"
import NotUnlocked from "@/components/upgrade/not-unlocked"

export default async function HourlyFamePage({ params }) {
  const { tag } = params
  const [{ data: clan }, plusClan] = await Promise.all([getClan(tag, true), getPlusClanData(tag, true)])

  let content = <NotUnlocked />

  if (plusClan) {
    const seasons = Object.keys(plusClan.hourlyAverages)
    let lastSeasonWeeks = []
    let lastWeekDays = []

    if (seasons.length) {
      lastSeasonWeeks = Object.keys(plusClan.hourlyAverages[seasons[seasons.length - 1]])
      lastWeekDays = Object.keys(
        plusClan.hourlyAverages[seasons[seasons.length - 1]][lastSeasonWeeks[lastSeasonWeeks.length - 1]],
      )
    }

    content = (
      <HourlyAvgContent
        data={plusClan.hourlyAverages}
        initialDay={{
          day: lastWeekDays[lastWeekDays.length - 1],
          season: seasons[seasons.length - 1],
          week: lastSeasonWeeks[lastSeasonWeeks.length - 1],
        }}
      />
    )
  }

  return (
    <>
      <ClanHeader clan={clan} />
      <Container py="xl" size="lg">
        {content}
      </Container>
    </>
  )
}
