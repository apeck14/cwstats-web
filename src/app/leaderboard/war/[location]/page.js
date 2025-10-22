import { notFound } from "next/navigation"

import { getWarLeaderboard } from "@/actions/supercell"
import { getAllClanTiers } from "@/actions/upgrade"
import LeaderboardContent from "@/components/leaderboard/leaderboard-content"
import { getRegionByKey } from "@/lib/functions/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }) {
  const { location } = params
  const region = getRegionByKey(location)

  if (!region) return

  const formattedKey = location.toLowerCase()

  return {
    description: `View war rankings for ${region.name}.`,
    openGraph: {
      images: `/assets/flag-icons/${formattedKey}.webp`,
    },
    title: `${region.name} | War Leaderboard - CWStats`,
  }
}

export default async function WarLeaderboardPage({ params }) {
  const { location } = params
  const region = getRegionByKey(location)

  if (!region) notFound()

  const [{ data: leaderboard }, clanTiers] = await Promise.all([getWarLeaderboard(region?.id), getAllClanTiers()])

  const plusClans = new Set(clanTiers.map((c) => c.tag))
  const proClans = new Set(clanTiers.filter((c) => c.isPro).map((c) => c.tag))

  return (
    <LeaderboardContent
      clans={leaderboard || []}
      isWarLb
      location={location}
      plusClanTags={plusClans}
      proClanTags={proClans}
    />
  )
}
