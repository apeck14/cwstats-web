import { getLinkedClans, getServerSettings } from "@/actions/server"
import { getAllPlusClans } from "@/actions/upgrade"
import ServerHeader from "@/components/me/header"
import ServerClansContent from "@/components/me/server-clans/server-clans-content"

export const dynamic = "force-dynamic"

export default async function ClansPage({ params }) {
  const [{ clans }, plusClans, { guild }] = await Promise.all([
    getLinkedClans(params.id),
    getAllPlusClans(true),
    getServerSettings(params.id, true, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <ServerClansContent
        discordInviteCode={guild?.discordInviteCode}
        id={params.id}
        linkedClans={clans || []}
        plusClans={plusClans || []}
      />
    </>
  )
}
