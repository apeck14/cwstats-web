import { Container } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan } from "@/actions/supercell"
import { getPlusClanData } from "@/actions/upgrade"
import ClanHeader from "@/components/clan/header"
import DailyTrackingContent from "@/components/clan/plus/daily-tracking/daily-tracking-content"
import NotUnlocked from "@/components/upgrade/not-unlocked"
import { getSupercellRedirectRoute } from "@/lib/functions/utils"

const shouldCutoff = (d, nextDay) =>
  (d === 5 && nextDay !== 4) || (d === 6 && nextDay !== 5 && nextDay !== 4) || (d === 0 && nextDay === 0)

function groupByWeek(days) {
  const result = []
  let tempGroup = []

  for (let i = 0; i < days.length; i++) {
    const d = days[i]
    const nextDay = days[i + 1]

    tempGroup.push(d)

    if (d === 4 || shouldCutoff(d, nextDay)) {
      result.push(tempGroup)
      tempGroup = []
    }
  }

  if (tempGroup.length > 0) {
    result.push(tempGroup)
  }

  return result
}

// [{ label: "Current Week", start: 0, length: 3 }, ...]
function groupsToData(groups, timestamps) {
  // determine if current season by timestamps of first group
  // else just map to UTC first and last day of each group
  const data = []
  let tsIndex = 0 // timestamp index

  for (const group of groups) {
    const entry = { length: group.length, start: tsIndex }
    let label

    if (tsIndex === 0 && group.length < 4) {
      label = "Current Week"
    } else if (group.length) {
      // TODO: determine thursday and sunday date strings from first entry timestamp
      const date = timestamps[tsIndex + group.length - 1]
      const startDateStr = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
      })

      date.setUTCDate(date.getUTCDate() + 3)
      const endDateStr = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
      })

      label = `${startDateStr} - ${endDateStr}`
    }

    data.push({ ...entry, label })
    tsIndex += group.length
  }

  return data
}

export default async function DailyTrackingPage({ params }) {
  const { tag } = params
  const [{ data: clan, status }, plusClan] = await Promise.all([getClan(tag), getPlusClanData(tag)])

  if (status !== 200) redirect(getSupercellRedirectRoute(status))
  else {
    const dailyTrackingData = plusClan?.dailyTracking?.reverse() || []
    const timestamps = dailyTrackingData.map((e) => e.timestamp)
    const utcDays = timestamps.map((e) => e.getUTCDay())
    const groupedByWeek = groupByWeek(utcDays)
    const weeks = groupsToData(groupedByWeek, timestamps)

    return (
      <>
        <ClanHeader clan={clan} />
        <Container py="xl" size="lg">
          {plusClan ? <DailyTrackingContent data={dailyTrackingData} weekData={weeks} /> : <NotUnlocked />}
        </Container>
      </>
    )
  }
}
