import { Container } from "@mantine/core"

import { getPlayer } from "@/actions/supercell"
import PlayerHeader from "@/components/player/header"
import ComingSoon from "@/components/ui/coming-soon"
import { getArenaFileName } from "@/lib/functions/utils"

export async function generateMetadata({ params }) {
  const { tag } = params
  const { data: player } = await getPlayer(tag)

  return {
    description: "View advanced player stats, card levels, battle log, & more!",
    openGraph: {
      images: `/assets/arenas/${getArenaFileName(player?.arena?.name)}.webp`,
    },
    title: `${player.name} ${player.tag} | Battles - CWStats`,
  }
}

export default async function BattlesPage({ params }) {
  const { tag } = params
  const { data: player } = await getPlayer(tag, true)

  return (
    <>
      <PlayerHeader player={player} />
      <Container size="lg">
        <ComingSoon />
      </Container>
    </>
  )
}
