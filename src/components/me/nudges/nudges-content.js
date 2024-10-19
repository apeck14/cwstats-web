import { Container, Stack } from "@mantine/core"

import { calcNudgeLimit } from "@/lib/functions/utils"

import ScheduledNudges from "./scheduled-nudges"
import Settings from "./settings"

export default function NudgesContent({ channels, guild, linkedClansCount }) {
  const nudgeLimit = calcNudgeLimit(linkedClansCount)

  return (
    <Container py="xl" size="lg">
      <Stack gap="3rem">
        <Settings guild={guild} />
        <ScheduledNudges channels={channels} guild={guild} limit={nudgeLimit} />
      </Stack>
    </Container>
  )
}
