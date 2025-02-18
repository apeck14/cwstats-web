import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { getLinkedAccount } from "@/actions/user"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SavedContent from "@/components/me/saved-content"

export const metadata = {
  description: "View my saved players in CWStats.",
  title: "My Players | CWStats",
}

export default async function PlayersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const linkedAccount = await getLinkedAccount()

  return <SavedContent items={linkedAccount.savedPlayers} />
}
