import { getLinkedClanByTag } from "@/actions/server"
import { isPlusClan } from "@/actions/upgrade"
import { followClan, getLinkedAccount, unfollowClan } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function ClanHeader({ clan }) {
  const [linkedAccount, isPlus, linkedClan] = await Promise.all([
    getLinkedAccount(),
    isPlusClan(clan?.tag),
    getLinkedClanByTag(clan?.tag),
  ])
  const clanFollowed = !!linkedAccount?.savedClans?.find((c) => c.tag === clan?.tag)

  return (
    <HeaderContent
      clan={clan}
      clanFollowed={clanFollowed}
      discordID={linkedAccount?.discordID}
      discordInviteCode={linkedClan?.clan?.discordInviteCode}
      followClan={followClan}
      isPlus={isPlus}
      unfollowClan={unfollowClan}
    />
  )
}
