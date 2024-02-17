import { getLinkedAccount } from "../actions/user"
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
