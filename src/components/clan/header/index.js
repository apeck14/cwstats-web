import { getLinkedClanByTag } from "@/actions/server"
import { isPlusClan } from "@/actions/upgrade"
import { followClan, unfollowClan } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function ClanHeader({ clan }) {
  const [isPlus, linkedClan] = await Promise.all([isPlusClan(clan?.tag), getLinkedClanByTag(clan?.tag)])

  return (
    <HeaderContent
      clan={clan}
      discordInviteCode={linkedClan?.clan?.discordInviteCode}
      followClan={followClan}
      isPlus={isPlus}
      unfollowClan={unfollowClan}
    />
  )
}
