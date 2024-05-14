import { Container, Group, Title } from "@mantine/core"

import { getClan, getRaceLog } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import LogStats from "@/components/clan/log/log-stats"
import LogWeeks from "@/components/clan/log/log-weeks"
import InfoPopover from "@/components/ui/info-popover"
import { getClanBadgeFileName } from "@/lib/functions/utils"

export const dynamic = "force-dynamic"

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
  const [{ data: clan }, { data: log }] = await Promise.all([getClan(tag, true), getRaceLog(tag, true, true)])

  return (
    <>
      <ClanHeader clan={clan} />
      <Container py="lg" size="lg">
        <Group gap="xs" justify="center">
          <Title>Race Log</Title>
          <InfoPopover iconSize="1.25rem" text="Race logs only contain the last 10 weeks, per Supercell." />
        </Group>

        <LogStats log={log} />
        <LogWeeks log={log} tag={clan.tag} />
      </Container>
    </>
  )
}
