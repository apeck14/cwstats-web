import { getClan } from "@/actions/supercell"
import { followPlayer, unfollowPlayer } from "@/actions/user"

import HeaderContent from "./header-content"

export default async function PlayerHeader({ player }) {
  let clan

  if (player?.clan?.tag) {
    const clanData = await getClan(player?.clan?.tag)
    clan = clanData.data
  }

  return <HeaderContent clan={clan} followPlayer={followPlayer} player={player} unfollowPlayer={unfollowPlayer} />
}
