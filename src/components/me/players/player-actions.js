import { Card, Group, Stack, Title } from "@mantine/core"

import InfoPopover from "@/components/ui/info-popover"

import AddByClanModal from "./add-by-clan-modal"
import AddLinkedAccount from "./add-linked-account"
import PruneModal from "./prune-modal"

export default function PlayerActions({ guildID, limit, linkedAccounts, setLinkedAccounts, users }) {
  return (
    <Stack>
      <Group>
        <Title size="h3">Linked Players</Title>
        <InfoPopover text="Link Discord users to Clash Royale players. These links are used for scheduled nudges, /nudge, and other features that are in the works." />
      </Group>

      <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8" component={Stack} gap="xs">
        <Title size="h5">Quick Actions</Title>
        <Group>
          <AddByClanModal
            guildID={guildID}
            linkedAccounts={linkedAccounts}
            linksRemaining={limit - linkedAccounts.length}
            setLinkedAccounts={setLinkedAccounts}
            users={users}
          />
          <PruneModal />
        </Group>
      </Card>

      <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8" component={Stack} gap="xs">
        <Title size="h5">Link an Individual Player</Title>
        <AddLinkedAccount
          disabled={linkedAccounts.length >= limit}
          id={guildID}
          linkedAccounts={linkedAccounts}
          setLinkedAccounts={setLinkedAccounts}
        />
      </Card>
    </Stack>
  )
}
