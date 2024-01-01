"use client"

import { Button, Group, Modal, ScrollArea, Stack, Title, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"

import { getClanMembers } from "../../actions/supercell"
import useWindowSize from "../../hooks/useWindowSize"
import { breakpointObj, getClanBadgeFileName } from "../../lib/functions"
import DebouncedSearch from "../ui/debounced-search"
import Image from "../ui/image"

export default function SearchByClanModal({ onPlayerSelect }) {
  const { breakpoint } = useWindowSize()
  const [members, setMembers] = useState([])
  const [clan, setClan] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)

  const handleClose = () => {
    close()
    setMembers([])
    setClan(null)
  }

  const handleClanSelect = async (clan) => {
    setClan(clan)
    const { data: memberList, status } = await getClanMembers(clan?.tag)

    if (status === 200) {
      setMembers(memberList.map((m) => ({ name: m.name, tag: m.tag })).sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  const handlePlayerSelect = (player, clan) => {
    handleClose()
    onPlayerSelect(player, clan)
  }

  const centerModal = breakpoint === "md" || breakpoint === "lg" || breakpoint === "xl"

  return (
    <>
      <Modal
        centered={centerModal}
        onClose={handleClose}
        opened={opened}
        title={<Title fz="1.25rem">Find Player by Clan</Title>}
      >
        {clan ? (
          <Group fw={600} gap="xs">
            <Image
              height={26}
              src={`/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.png`}
              width={12}
            />
            {clan?.name}
          </Group>
        ) : (
          <DebouncedSearch isClans label="Clan Name" onSelect={handleClanSelect} required />
        )}

        {members.length ? (
          <ScrollArea bg="gray.9" h="30vh" mt="md" type="always">
            <Stack gap={0}>
              {members.map((m) => (
                <UnstyledButton
                  bg="gray.9"
                  className="buttonHover"
                  onClick={() => handlePlayerSelect(m, clan)}
                  px="xs"
                  py="0.25rem"
                >
                  {m.name}
                </UnstyledButton>
              ))}
            </Stack>
          </ScrollArea>
        ) : null}
      </Modal>
      <Button onClick={open} size={breakpointObj("xs", "xs", "sm")[breakpoint]} variant="default" w="fit-content">
        Search by clan?
      </Button>
    </>
  )
}
