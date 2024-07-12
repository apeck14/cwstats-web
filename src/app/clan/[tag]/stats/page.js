import { Container } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import ComingSoon from "@/components/ui/coming-soon"
import { getClanBadgeFileName, getSupercellRedirectRoute } from "@/lib/functions/utils"

export async function generateMetadata({ params }) {
  const { tag } = params
  const { data: clan } = await getClan(tag)

  if (!clan) return

  return {
    description: clan.description,
    openGraph: {
      images: `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`,
    },
    title: `${clan.name} ${clan.tag} | Stats - CWStats`,
  }
}

export default async function ClanPlusPage({ params }) {
  const { tag } = params
  const { data: clan, status } = await getClan(tag)

  if (status !== 200) redirect(getSupercellRedirectRoute(status))
  else {
    return (
      <>
        <ClanHeader clan={clan} />
        <Container size="lg">
          <ComingSoon />
        </Container>
      </>
    )
  }
}
