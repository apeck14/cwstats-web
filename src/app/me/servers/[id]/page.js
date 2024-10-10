import { getGuild } from "@/actions/discord"
import { getServerSettings } from "@/actions/server"
import ServerHeader from "@/components/me/header"
import HomeContent from "@/components/me/home/home-content"

export const metadata = {
  description: "View my Discord servers in CWStats.",
  title: "My Servers | CWStats",
}

export const dynamic = "force-dynamic"

export default async function ServerPage({ params }) {
  const [{ guild }, { data: guildData }] = await Promise.all([
    getServerSettings(params.id, true),
    getGuild(params.id, true),
  ])

  return (
    <>
      <ServerHeader id={params.id} />
      <HomeContent guild={guild} roles={guildData.roles} />
    </>
  )
}
