import { isPlusClan } from "@/actions/upgrade"
import { followClan, getLinkedAccount, unfollowClan } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function ClanHeader({ clan }) {
  const [linkedAccount, isPlus] = await Promise.all([getLinkedAccount(), isPlusClan(clan?.tag)])
  const clanFollowed = !!linkedAccount?.savedClans?.find((c) => c.tag === clan?.tag)

  return (
    <HeaderContent
      clan={clan}
      clanFollowed={clanFollowed}
      discordID={linkedAccount?.discordID}
      followClan={followClan}
      isPlus={isPlus}
      unfollowClan={unfollowClan}
    />
  )
}
