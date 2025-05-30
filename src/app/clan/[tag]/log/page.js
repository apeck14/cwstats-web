import { Container, Group, Title } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan, getRaceLog } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import LogStats from "@/components/clan/log/log-stats"
import LogWeeks from "@/components/clan/log/log-weeks"
import InfoPopover from "@/components/ui/info-popover"
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
    title: `${clan.name} ${clan.tag} | Log - CWStats`,
  }
}

export default async function ClanLogPage({ params }) {
  const { tag } = params
  const [{ data: clan, status: clanStatus }, { data: log }] = await Promise.all([
    getClan(tag),
    getRaceLog(tag, true, true),
  ])

  if (clanStatus !== 200) redirect(getSupercellRedirectRoute(clanStatus))
  else {
    return (
      <>
        <ClanHeader clan={clan} />
        <Container py="lg" size="lg">
          {!log ? (
            <Title c="gray.1" mt="xl" size="h3" ta="center">
              This clan has not participated in any river races.
            </Title>
          ) : (
            <>
              <Group gap="xs" justify="center">
                <Title>Race Log</Title>
                <InfoPopover iconSize="1.25rem" text="Race logs only contain the last 10 weeks, per Supercell." />
              </Group>
              <LogStats log={log} />
              <LogWeeks log={log} tag={clan.tag} />
            </>
          )}
        </Container>
      </>
    )
  }
}
