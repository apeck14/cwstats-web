import { Container, Stack } from "@mantine/core"

import { calcLinkedPlayerLimit, calcNudgeLimit } from "@/lib/functions/utils"

import LinkedAccounts from "./linked-accounts"
import ScheduledNudges from "./scheduled-nudges"
import Settings from "./settings"

export default function NudgesContent({ channels, guild, linkedClansCount }) {
  const nudgeLimit = calcNudgeLimit(linkedClansCount)
  const linkedPlayerLimit = calcLinkedPlayerLimit(linkedClansCount)

  return (
    <Container py="xl" size="lg">
      <Stack gap="3rem">
        <Settings guild={guild} />
        <ScheduledNudges channels={channels} guild={guild} limit={nudgeLimit} />
        <LinkedAccounts guild={guild} limit={linkedPlayerLimit} />
      </Stack>
    </Container>
  )
}
