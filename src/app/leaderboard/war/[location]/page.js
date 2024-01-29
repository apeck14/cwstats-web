import { notFound } from "next/navigation"

import LeaderboardHeader from "../../../../components/leaderboard/header"
import { getRegionByKey } from "../../../../lib/functions/utils"

export default function WarLeaderboardPage({ params }) {
  const { location } = params
  const region = getRegionByKey(location)

  if (!region) notFound()

  return <LeaderboardHeader region={region} />
}
