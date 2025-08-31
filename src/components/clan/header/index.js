import { getLinkedClanByTag } from "@/actions/server"
import { getClanTiers } from "@/actions/upgrade"
import { followClan, unfollowClan } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function ClanHeader({ clan }) {
  const [clanTiers, linkedClan] = await Promise.all([getClanTiers(clan?.tag), getLinkedClanByTag(clan?.tag)])

  return (
    <HeaderContent
      clan={{ ...clan, ...clanTiers }}
      discordInviteCode={linkedClan?.clan?.discordInviteCode}
      followClan={followClan}
      unfollowClan={unfollowClan}
    />
  )
}
