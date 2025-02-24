import { Container } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan } from "@/actions/supercell"
import { getPlusClanData } from "@/actions/upgrade"
import ClanHeader from "@/components/clan/header"
import DailyTrackingContent from "@/components/clan/plus/daily-tracking/daily-tracking-content"
import NotUnlocked from "@/components/upgrade/not-unlocked"
import { getSupercellRedirectRoute } from "@/lib/functions/utils"

function groupByWeek(entries) {
  // label = "Current Week" | "118-5"
  const groupedData = {} // { 'Current Week': []}
  const now = new Date()

  for (const e of entries) {
    const { season, timestamp, week } = e

    const lastDayOfWeek = timestamp.getUTCDay()
    const daysToThursday = 4 - (lastDayOfWeek === 0 ? 7 : lastDayOfWeek)
    const daysToSunday = (7 - lastDayOfWeek) % 7

    const thursday = new Date(timestamp)
    thursday.setDate(timestamp.getDate() + daysToThursday)

    const sunday = new Date(timestamp)
    sunday.setDate(timestamp.getDate() + daysToSunday)

    const endOfWeek = new Date(sunday)
    endOfWeek.setDate(sunday.getDate() + 1)
    endOfWeek.setUTCHours(10)

    const isCurrentWeek = now >= thursday && now <= endOfWeek
    const label = isCurrentWeek ? "Current Week" : `${season}-${week}`

    if (Object.prototype.hasOwnProperty.call(groupedData, label)) {
      groupedData[label].push(e)
    } else {
      groupedData[label] = [e]
    }
  }

  return groupedData
}

export default async function DailyTrackingPage({ params }) {
  const { tag } = params
  const [{ data: clan, status }, plusClan] = await Promise.all([getClan(tag), getPlusClanData(tag)])

  if (status !== 200) redirect(getSupercellRedirectRoute(status))
  else {
    const dailyTrackingData = plusClan?.dailyTracking?.reverse() || []
    const groupedByWeek = groupByWeek(dailyTrackingData)
    const labels = Object.keys(groupedByWeek)

    return (
      <>
        <ClanHeader clan={clan} />
        <Container py="xl" size="lg">
          {plusClan ? (
            <DailyTrackingContent
              data={groupedByWeek}
              memberTags={clan?.memberList?.map((m) => m.tag)}
              weekLabels={labels}
            />
          ) : (
            <NotUnlocked />
          )}
        </Container>
      </>
    )
  }
}
