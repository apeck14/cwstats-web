import { getDailyLeaderboard, getLinkedAccount } from "../../../../actions/api"
import LeaderboardContent from "../../../../components/leaderboard/leaderboard-content"

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
