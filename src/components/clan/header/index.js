import { getLinkedClanByTag } from "@/actions/server"
import { getAllPlusClans, getAllProClans } from "@/actions/upgrade"
import { followClan, unfollowClan } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function ClanHeader({ clan }) {
  const [proClanTags, plusClanTags, linkedClan] = await Promise.all([
    getAllProClans(true),
    getAllPlusClans(true),
    getLinkedClanByTag(clan?.tag),
  ])

  clan.isPlus = plusClanTags.includes(clan?.tag)
  clan.isPro = proClanTags.includes(clan?.tag)

  return (
    <HeaderContent
      clan={clan}
      discordInviteCode={linkedClan?.clan?.discordInviteCode}
      followClan={followClan}
      unfollowClan={unfollowClan}
    />
  )
}
