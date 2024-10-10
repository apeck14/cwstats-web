import { getGuildChannels } from "@/actions/discord"
import { getServerSettings } from "@/actions/server"
import ServerHeader from "@/components/me/header"
import NudgesContent from "@/components/me/nudges/nudges-content"

export const dynamic = "force-dynamic"

export default async function NudgesPage({ params }) {
  const [{ guild }, { data: channels }] = await Promise.all([
    getServerSettings(params.id, true),
    getGuildChannels(params.id, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <NudgesContent channels={channels} guild={guild} />
    </>
  )
}
