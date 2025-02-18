import { getLinkedAccount } from "@/actions/user"
import SavedContent from "@/components/me/saved-content"

export const metadata = {
  description: "View my saved players in CWStats.",
  title: "My Players | CWStats",
}

export default async function PlayersPage() {
  const linkedAccount = await getLinkedAccount()

  return <SavedContent items={linkedAccount.savedPlayers} />
}
