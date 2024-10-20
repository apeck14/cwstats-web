import { getGuildChannels } from "@/actions/discord"
import { getLinkedClans, getServerSettings } from "@/actions/server"
import ServerHeader from "@/components/me/header"
import NudgesContent from "@/components/me/nudges/nudges-content"

export const dynamic = "force-dynamic"

export default async function NudgesPage({ params }) {
  const [{ guild }, { data: channels }, { clans }] = await Promise.all([
    getServerSettings(params.id, true),
    getGuildChannels(params.id, true),
    getLinkedClans(params.id, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <NudgesContent channels={channels} guild={guild} linkedClansCount={clans.length} />
    </>
  )
}
