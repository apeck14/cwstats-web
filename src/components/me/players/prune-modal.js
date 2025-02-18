import { Button, Group, Modal, Skeleton, Stack, Text, Title } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useState } from "react"

import { bulkUnlinkAccounts } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import { embedColors } from "@/static/colors"

export default function PruneModal({ guildID, linkedAccounts, setLinkedAccounts }) {
  const [unlinkedUsers, setUnlinkedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const [opened, { close, open }] = useDisclosure(false)
  const isTablet = useMediaQuery("(max-width: 48em)")

  const handleClose = () => {
    close()
    setUnlinkedUsers([])
    setShowButtons(true)
  }

  const handleConfirm = async () => {
    setShowButtons(false)

    setLoading(true)
    const { error, linksRemoved } = await bulkUnlinkAccounts(guildID)
    setLoading(false)

    if (!error) {
      setUnlinkedUsers(linksRemoved)
      setLinkedAccounts(linkedAccounts.filter((a) => !linksRemoved.find((l) => l.tag === a.tag)))

      // dont show notifcation if no users unlinked
      if (linksRemoved.length) {
        notifications.show({
          autoClose: 7000,
          color: "green",
          message: `${linksRemoved.length} link(s) were successfully removed.`,
          title: "Link(s) removed!",
        })
      }

      sendLogWebhook(
        {
          color: embedColors.orange,
          details: `**${linksRemoved.length}** link(s) removed.`,
          guild: guildID,
          title: "Prune Used",
        },
        true,
      )
    }
  }

  return (
    <>
      <Modal centered={!isTablet} onClose={handleClose} opened={opened} title={<Title fz="1.25rem">Prune</Title>}>
        <Stack gap="sm">
          {showButtons ? (
            <>
              <Text c="gray.1" size="sm">
                <span style={{ color: "var(--mantine-color-yellow-6)" }}>WARNING:</span> This will remove all links for
                users no longer in your server.
              </Text>
              <Text size="sm">Are you sure you&apos;d like to continue?</Text>
              <Group gap="xs" justify="flex-end">
                <Button color="green" onClick={handleConfirm} size="xs">
                  Yes
                </Button>
                <Button color="red" onClick={handleClose} size="xs">
                  No
                </Button>
              </Group>
            </>
          ) : loading ? (
            <Stack gap="xs">
              <Skeleton height={8} radius="xl" width="50%" />
              <Skeleton height={8} radius="xl" width="42%" />
              <Skeleton height={8} radius="xl" width="46%" />
            </Stack>
          ) : unlinkedUsers.length ? (
            <Stack>
              <Text c="gray.1" size="sm">
                <span style={{ color: "var(--mantine-color-green-6)" }}>{unlinkedUsers.length}</span> player(s)
                successfully unlinked:
              </Text>
              {unlinkedUsers.map((u) => (
                <Group gap="0.25rem" key={u.tag}>
                  <IconCheck color="var(--mantine-color-green-6)" size="1rem" />
                  <Text size="sm">{u.name}</Text>
                  <Text c="dimmed" size="sm">
                    ({u.tag})
                  </Text>
                </Group>
              ))}
            </Stack>
          ) : (
            "No users unlinked."
          )}
        </Stack>
      </Modal>
      <Button color="red" onClick={open} size="xs" variant="light">
        Prune
      </Button>
    </>
  )
}
