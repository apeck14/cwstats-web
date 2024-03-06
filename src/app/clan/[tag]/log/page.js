import { Container } from "@mantine/core"

import { getClan } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import ComingSoon from "@/components/ui/coming-soon"
import { getClanBadgeFileName } from "@/lib/functions/utils"

export async function generateMetadata({ params }) {
  const { tag } = params
  const { data: clan } = await getClan(tag)

  if (!clan) return

  return {
    description: clan.description,
    openGraph: {
      images: `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`,
    },
    title: `${clan.name} ${clan.tag} | Log - CWStats`,
  }
}

export default async function ClanLogPage({ params }) {
  const { tag } = params
  const [{ data: clan }] = await Promise.all([getClan(tag, true)])

  return (
    <>
      <ClanHeader clan={clan} />
      <Container size="lg">
        <ComingSoon />
      </Container>
    </>
  )
}
