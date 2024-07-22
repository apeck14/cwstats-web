import { notFound } from "next/navigation"

import { getWarLeaderboard } from "@/actions/supercell"
import { getAllPlusClans } from "@/actions/upgrade"
import { getLinkedAccount } from "@/actions/user"
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

  const [{ data: leaderboard }, linkedAccount, plusClans] = await Promise.all([
    getWarLeaderboard(region?.id),
    getLinkedAccount(),
    getAllPlusClans(true),
  ])

  return (
    <LeaderboardContent
      clans={leaderboard || []}
      isWarLb
      linkedAccount={linkedAccount}
      location={location}
      plusClans={plusClans}
    />
  )
}
