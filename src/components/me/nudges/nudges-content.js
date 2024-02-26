import { Container, Stack } from "@mantine/core"

import LinkedAccounts from "./linked-accounts"
import ScheduledNudges from "./scheduled-nudges"
import Settings from "./settings"

export default function NudgesContent({ channels, guild }) {
  return (
    <Container py="lg" size="lg">
      <Stack gap="xl">
        <Settings guild={guild} />
        <ScheduledNudges channels={channels} guild={guild} />
        <LinkedAccounts guild={guild} />
      </Stack>
    </Container>
  )
}
