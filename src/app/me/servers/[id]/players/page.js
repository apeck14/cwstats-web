import { getAllGuildUsers } from "@/actions/discord"
import { getLinkedClans, getServerSettings } from "@/actions/server"
import ServerHeader from "@/components/me/header"
import PlayersContent from "@/components/me/players/players-content"

export const dynamic = "force-dynamic"

export default async function PlayersPage({ params }) {
  const [{ guild }, { clans }, { members }] = await Promise.all([
    getServerSettings(params.id, true),
    getLinkedClans(params.id),
    getAllGuildUsers(params.id, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <PlayersContent guild={guild} linkedClansCount={clans.length} users={members} />
    </>
  )
}
