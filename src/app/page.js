import { getLinkedAccount } from "../actions/api"
import Home from "../components/home"

export default async function Page() {
  const linkedAccount = await getLinkedAccount()

  return (
    <Home
      loggedIn={linkedAccount.success}
      savedClans={linkedAccount.savedClans}
      savedPlayers={linkedAccount.savedPlayers}
    />
  )
}
