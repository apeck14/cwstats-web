import { getLinkedClans, getServerSettings } from "@/actions/server"
import ServerHeader from "@/components/me/header"
import PlayersContent from "@/components/me/players/players-content"

export const dynamic = "force-dynamic"

export default async function PlayersPage({ params }) {
  const [{ guild }, { clans }] = await Promise.all([getServerSettings(params.id, true), getLinkedClans(params.id)])

  return (
    <>
      <ServerHeader id={params.id} />
      <PlayersContent guild={guild} linkedClansCount={clans.length} />
    </>
  )
}
