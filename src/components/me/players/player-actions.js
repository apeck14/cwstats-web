import { Card, Checkbox, Group, SimpleGrid, Stack, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"

import InfoPopover from "@/components/ui/info-popover"

import { setUpdateNicknameUponLinking } from "../../../actions/server"
import SaveSettingsDialog from "../save-settings-dialog"
import AddLinkedAccount from "./add-linked-account"
import BulkLinkModal from "./bulk-link-modal"
import PruneModal from "./prune-modal"

export default function PlayerActions({ guildID, limit, linkedAccounts, setLinkedAccounts, updateNicknames, users }) {
  const [unsavedChecked, setUnsavedChecked] = useState(!!updateNicknames)
  const [savedChecked, setSavedChecked] = useState(!!updateNicknames)
  const [saveModalOpened, { close, open }] = useDisclosure(false)

  const handleChange = () => {
    if (!unsavedChecked === savedChecked) close()
    else open()

    setUnsavedChecked(!unsavedChecked)
  }

  const handleModalSave = () => {
    close()
    setSavedChecked(unsavedChecked)

    setUpdateNicknameUponLinking(guildID, unsavedChecked)
  }

  return (
    <>
      <Stack>
        <Group>
          <Title size="h3">Linked Players</Title>
          <InfoPopover text="Link Discord users to Clash Royale players. These links are used for scheduled nudges, /nudge, and other features that are in the works." />
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8" component={Stack} gap="xs">
            <Title size="h5">Quick Actions</Title>
            <Group>
              <BulkLinkModal
                guildID={guildID}
                linkedAccounts={linkedAccounts}
                linksRemaining={limit - linkedAccounts.length}
                setLinkedAccounts={setLinkedAccounts}
                updateNicknames={updateNicknames}
                users={users}
              />
              <PruneModal guildID={guildID} linkedAccounts={linkedAccounts} setLinkedAccounts={setLinkedAccounts} />
            </Group>
          </Card>

          <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8" component={Stack} gap="xs">
            <Title size="h5">Settings</Title>
            <Group gap="xs">
              <Checkbox
                checked={unsavedChecked}
                label="Update user's Discord nickname upon linking"
                onChange={handleChange}
              />
              <InfoPopover text="Ensure the bot has the *Manage Nicknames* permission in your server." />
            </Group>
          </Card>
        </SimpleGrid>

        <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8" component={Stack} gap="xs">
          <Title size="h5">Link an Individual Player</Title>
          <AddLinkedAccount
            disabled={linkedAccounts.length >= limit}
            id={guildID}
            linkedAccounts={linkedAccounts}
            setLinkedAccounts={setLinkedAccounts}
            updateNicknames={updateNicknames}
          />
        </Card>
      </Stack>
      <SaveSettingsDialog isOpen={saveModalOpened} onClose={close} onSave={handleModalSave} />
    </>
  )
}
