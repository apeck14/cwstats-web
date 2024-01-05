import { getLinkedAccount } from "../../../actions/api"
import { followClan, unfollowClan } from "../../../actions/user"
import HeaderContent from "./header-content"

export default async function ClanHeader({ clan, url }) {
  const linkedAccount = await getLinkedAccount()
  const clanFollowed = !!linkedAccount?.savedClans?.find((c) => c.tag === clan.tag)

  return (
    <HeaderContent
      clan={clan}
      clanFollowed={clanFollowed}
      discordID={linkedAccount?.discordID}
      followClan={followClan}
      unfollowClan={unfollowClan}
      url={url}
    />
  )
}
