import { Container } from "@mantine/core"

import { getPlayer } from "../../../../actions/supercell"
import PlayerHeader from "../../../../components/player/header"
import ComingSoon from "../../../../components/ui/coming-soon"

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
