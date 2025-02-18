import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { getAllPlusClans } from "@/actions/upgrade"
import { getLinkedAccount } from "@/actions/user"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SavedContent from "@/components/me/saved-content"

export const metadata = {
  description: "View my saved clans in CWStats.",
  title: "My Clans | CWStats",
}

export default async function ClansPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [linkedAccount, plusTags] = await Promise.all([getLinkedAccount(), getAllPlusClans(true)])

  const items = linkedAccount.savedClans.map((c) => ({ ...c, isPlus: plusTags.includes(c.tag) }))

  return <SavedContent items={items} />
}
