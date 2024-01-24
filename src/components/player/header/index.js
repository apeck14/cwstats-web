import { getLinkedAccount } from "../../../actions/api"
import { getClan } from "../../../actions/supercell"
import { followPlayer, unfollowPlayer } from "../../../actions/user"
import HeaderContent from "./header-content"

export default async function PlayerHeader({ player }) {
  const linkedAccount = await getLinkedAccount()
  const playerFollowed = !!linkedAccount?.savedPlayers?.find((p) => p.tag === player?.tag)
  let clan

  if (player?.clan?.tag) {
    const clanData = await getClan(player?.clan?.tag)
    clan = clanData.data
  }

  return (
    <HeaderContent
      clan={clan}
      discordID={linkedAccount?.discordID}
      followPlayer={followPlayer}
      player={player}
      playerFollowed={playerFollowed}
      unfollowPlayer={unfollowPlayer}
    />
  )
}
