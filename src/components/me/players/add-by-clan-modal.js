import { Button, Group, Input, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useState } from "react"

import { getUnlinkedPlayersByClan } from "@/actions/server"
import { getClanBadgeFileName } from "@/lib/functions/utils"

import DebouncedSearch from "../../ui/debounced-search"
import Image from "../../ui/image"

export default function AddByClanModal({ guildID }) {
  const [unlinkedMembers, setUnlinkedMembers] = useState([])
  const [clan, setClan] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)
  const isTablet = useMediaQuery("(max-width: 48em)")

  const handleClose = () => {
    close()
    setUnlinkedMembers([])
    setClan(null)
  }

  const handleClanSelect = async (clan) => {
    setClan(clan)
    const { error, players } = await getUnlinkedPlayersByClan(guildID, clan.tag)

    if (!error) {
      setUnlinkedMembers(players)
    }
  }

  const handleChange = (e, tag) => {
    const newUnlinkedMembers = [...unlinkedMembers]
    newUnlinkedMembers.find((m) => m.tag === tag).username = e.currentTarget.value

    setUnlinkedMembers(newUnlinkedMembers)
  }

  const handleSubmit = () => {
    // const usersToAdd = unlinkedMembers.filter((m) => m.username)
  }

  // TODO: account for 0 unlinked members

  return (
    <>
      <Modal centered={!isTablet} onClose={handleClose} opened={opened} title={<Title fz="1.25rem">Add By Clan</Title>}>
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
            <DebouncedSearch isClans label="Clan Name" onSelect={handleClanSelect} required />
          </Stack>
        )}

        {unlinkedMembers.length ? (
          <Stack mt="md">
            <Text c="dimmed" size="sm">
              Unlinked Members: <span style={{ color: "var(--mantine-color-red-6)" }}>{unlinkedMembers.length}</span>
            </Text>
            <ScrollArea h="50vh" type="always">
              <Stack gap="0.25rem">
                {unlinkedMembers.map((m) => (
                  <Group bg="gray.8" justify="space-between" key={m.tag} p="xs">
                    <Text size="sm">{m.name}</Text>
                    <Input
                      maw="8rem"
                      onChange={(e) => handleChange(e, m.tag)}
                      placeholder="Discord Username"
                      size="xs"
                    />
                  </Group>
                ))}
              </Stack>
            </ScrollArea>
            <Button maw="4rem" onClick={handleSubmit} style={{ alignSelf: "flex-end" }}>
              Add
            </Button>
          </Stack>
        ) : null}
      </Modal>
      <Button color="green" disabled onClick={open} size="xs" variant="light">
        Add By Clan
      </Button>
    </>
  )
}
