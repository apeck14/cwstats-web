import { getGuildChannels } from "@/actions/discord"
import { getLinkedClans, getServerSettings } from "@/actions/server"
import { getAllPlusClans, getAllProClans } from "@/actions/upgrade"
import ServerHeader from "@/components/me/header"
import ServerClansContent from "@/components/me/server-clans/server-clans-content"

export const dynamic = "force-dynamic"

export default async function ClansPage({ params }) {
  const [{ clans }, { guild }, { data: channels }, proClans, plusClanTags] = await Promise.all([
    getLinkedClans(params.id),
    getServerSettings(params.id, true),
    getGuildChannels(params.id, true),
    getAllProClans(),
    getAllPlusClans(true),
  ])

  for (const c of clans) {
    const proClan = proClans.find((cl) => cl.tag === c.tag)

    if (proClan) {
      Object.assign(c, proClan, { isPlus: true, isPro: true })
    } else {
      c.isPlus = plusClanTags.includes(c.tag)
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
