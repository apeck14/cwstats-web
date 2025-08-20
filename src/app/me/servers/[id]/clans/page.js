import { getGuildChannels } from "@/actions/discord"
import { getLinkedClans, getServerSettings } from "@/actions/server"
import { getAllPlusClans } from "@/actions/upgrade"
import ServerHeader from "@/components/me/header"
import ServerClansContent from "@/components/me/server-clans/server-clans-content"

export const dynamic = "force-dynamic"

export default async function ClansPage({ params }) {
  const [{ clans }, plusClans, { guild }, { data: channels }] = await Promise.all([
    getLinkedClans(params.id),
    getAllPlusClans(true),
    getServerSettings(params.id, true),
    getGuildChannels(params.id, true),
  ])

  for (const c of clans) {
    const isPlus = plusClans.includes(c.tag)
    if (isPlus) {
      c.plus = true
    }
  }

  return (
    <>
      <ServerHeader id={params.id} />
      <ServerClansContent
        channels={channels}
        discordInviteCode={guild?.discordInviteCode}
        id={params.id}
        linkedClans={clans || []}
      />
    </>
  )
}
