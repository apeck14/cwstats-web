import { getDailyLeaderboard } from "@/actions/api"
import { getLinkedAccount } from "@/actions/user"
import LeaderboardContent from "@/components/leaderboard/leaderboard-content"
import { getRegionByKey } from "@/lib/functions/utils"

export async function generateMetadata({ params }) {
  const { location } = params
  const region = getRegionByKey(location)
  const formattedKey = location.toLowerCase()

  return {
    description: `View daily war rankings for ${region.name}.`,
    openGraph: {
      images: `/assets/flag-icons/${formattedKey}.webp`,
    },
    title: `${region.name} | Daily Leaderboard - CWStats`,
  }
}

export default async function DailyLeaderboardPage({ params }) {
  const { location } = params
  const leaderboard = await getDailyLeaderboard({ key: location })
  const linkedAccount = await getLinkedAccount()

  return (
    <LeaderboardContent
      clans={leaderboard?.dailyLbArr || []}
      lastUpdated={leaderboard?.lbLastUpdated}
      linkedAccount={linkedAccount}
      location={location}
    />
  )
}
