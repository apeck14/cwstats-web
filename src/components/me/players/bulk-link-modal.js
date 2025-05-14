import { Button, Group, Modal, ScrollArea, Select, Stack, Text, Title } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { bulkLinkAccounts, getUnlinkedPlayersByClan } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import { getClanBadgeFileName } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import DebouncedSearch from "../../ui/debounced-search"
import Image from "../../ui/image"

export default function BulkLinkModal({
  guildID,
  linkedAccounts,
  linksRemaining,
  setLinkedAccounts,
  updateNicknames,
  users,
}) {
  const [unlinkedMembers, setUnlinkedMembers] = useState([])
  const [clan, setClan] = useState(null)
  const [clanLoading, setClanLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [linksLeft, setLinksLeft] = useState(linksRemaining)
  const [showButton, setShowButton] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const isTablet = useMediaQuery("(max-width: 48em)")

  const usersToAdd = unlinkedMembers.filter((m) => m?.username?.trim())

  const handleClose = () => {
    close()
    setUnlinkedMembers([])
    setShowButton(false)
    setClan(null)
  }

  const handleClanSelect = async (clan) => {
    setClan(clan)

    setClanLoading(true)
    const { error, players } = await getUnlinkedPlayersByClan(guildID, clan.tag)
    setClanLoading(false)

    if (!error) {
      setUnlinkedMembers(players)
    }
  }

  const handleChange = (e, tag) => {
    const selectedUsername = e?.split("__")[0] // remove suffix
    const newLinksLeft = linksLeft - (e ? 1 : -1)

    setLinksLeft(newLinksLeft)
    setShowButton(newLinksLeft !== linksRemaining)

    const newUnlinkedMembers = [...unlinkedMembers]
    newUnlinkedMembers.find((m) => m.tag === tag).username = selectedUsername
    setUnlinkedMembers(newUnlinkedMembers)
  }

  const handleSubmit = async () => {
    setLoading(true)

    const { players } = await bulkLinkAccounts(guildID, usersToAdd, !!updateNicknames)

    const newUnlinkedMembers = []
    const playersAdded = []

    for (const m of unlinkedMembers) {
      const player = players.find((p) => p.tag === m.tag)

      if (player?.added) {
        playersAdded.push(player)
      } else {
        newUnlinkedMembers.push({ ...m, ...player })
      }
    }

    setUnlinkedMembers(newUnlinkedMembers)

    if (playersAdded.length) {
      setLinkedAccounts([...linkedAccounts, ...playersAdded])
      notifications.show({
        autoClose: 7000,
        color: "green",
        message: `${playersAdded.length} player(s) were successfully linked.`,
        title: "Player(s) linked!",
      })
    }

    sendLogWebhook(
      {
        clan: clan.name,
        color: embedColors.orange,
        details: `**${playersAdded.length}** player(s) linked.`,
        guild: guildID,
        tag: clan.tag,
        title: "Bulk Link Used",
      },
      true,
    )

    setLinksLeft(linksRemaining - playersAdded.length)
    setLoading(false)
    setShowButton(false)
  }

  const allUsernames = useMemo(() => {
    const counts = new Map()
    return users.map((u) => {
      const { username } = u
      const count = counts.get(username) || 0
      counts.set(username, count + 1)

      return {
        label: username,
        value: count === 0 ? username : `${username}__${count}`, // suffix to make it unique
      }
    })
  }, [users])

  const unlinkedMemberCount = unlinkedMembers.filter((m) => !m.username).length

  return (
    <>
      <Modal centered={!isTablet} onClose={handleClose} opened={opened} title={<Title fz="1.25rem">Bulk Link</Title>}>
        {clan ? (
          <Group fw={600} gap="xs">
            <Image
              alt="Clan Badge"
              height={26}
              src={`/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`}
              unoptimized
            />
            {clan?.name}
          </Group>
        ) : (
          <Stack gap="xs">
            <Text c="dimmed" size="sm">
              Quickly find and link unlinked players by clan.
            </Text>
            <DebouncedSearch checkIfTag isClans label="Clan Name" onSelect={handleClanSelect} required />
          </Stack>
        )}

        {!clan || clanLoading ? null : clan && !unlinkedMembers.length ? (
          <Group gap="xs" mt="md">
            <IconCheck color="var(--mantine-color-green-6)" size="1.25rem" stroke={2} />
            <Text c="dimmed">All players from this clan are linked!</Text>
          </Group>
        ) : (
          <Stack mt="md">
            <Stack gap="0">
              <Text c="dimmed" size="sm">
                Links Remaining: <span style={{ color: "var(--mantine-color-green-6)" }}>{linksLeft}</span>
              </Text>
              <Text c="dimmed" size="sm">
                Unlinked Members: <span style={{ color: "var(--mantine-color-red-6)" }}>{unlinkedMemberCount}</span>
              </Text>
            </Stack>

            <ScrollArea h="50vh" type="always">
              <Stack gap="0.25rem">
                {unlinkedMembers.map((m) => (
                  <Group bg="gray.8" justify="space-between" key={m.tag} p="xs">
                    <Text size="sm">{m.name}</Text>
                    <Select
                      data={allUsernames}
                      error={m.error}
                      limit={3}
                      maw="8.5rem"
                      onChange={(e) => handleChange(e, m.tag)}
                      placeholder="Discord Username"
                      searchable
                      size="xs"
                    />
                  </Group>
                ))}
              </Stack>
            </ScrollArea>
            <Button
              disabled={!showButton || linksLeft < 0}
              loading={loading}
              miw="3.5rem"
              onClick={handleSubmit}
              px="xs"
              style={{ alignSelf: "flex-end" }}
            >
              Link {usersToAdd.length ? `(${usersToAdd.length})` : ""}
            </Button>
          </Stack>
        )}
      </Modal>
      <Button color="green" onClick={open} size="xs" variant="light">
        Bulk Link
      </Button>
    </>
  )
}
