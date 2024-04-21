import { getGuildChannels } from "@/actions/discord"
import { getServerSettings } from "@/actions/server"
import ChannelsContent from "@/components/me/channels/channels-content"
import ServerHeader from "@/components/me/header"

export const dynamic = "force-dynamic"

export default async function ChannelsPage({ params }) {
  const [{ guild }, { data: channels }] = await Promise.all([
    getServerSettings(params.id, true, true),
    getGuildChannels(params.id, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <ChannelsContent channels={channels} guild={guild} />
    </>
  )
}
