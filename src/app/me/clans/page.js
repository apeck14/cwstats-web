import { getAllPlusClans } from "@/actions/upgrade"
import SavedContent from "@/components/me/saved-content"

export const metadata = {
  description: "View my saved clans in CWStats.",
  title: "My Clans | CWStats",
}

export default async function ClansPage() {
  const plusTags = await getAllPlusClans(true)

  return <SavedContent plusTags={plusTags} />
}
