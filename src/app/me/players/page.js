import SavedContent from "@/components/me/saved-content"

export const metadata = {
  description: "View my saved players in CWStats.",
  title: "My Players | CWStats",
}

export default async function PlayersPage() {
  return <SavedContent />
}
