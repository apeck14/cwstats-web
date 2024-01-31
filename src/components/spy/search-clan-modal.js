"use client"

import { Button, Group, Modal, ScrollArea, Stack, Title, UnstyledButton } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useState } from "react"

import { getClanMembers } from "../../actions/supercell"
import { getClanBadgeFileName } from "../../lib/functions/utils"
import DebouncedSearch from "../ui/debounced-search"
import Image from "../ui/image"

export default function SearchByClanModal({ onPlayerSelect }) {
  const [members, setMembers] = useState([])
  const [clan, setClan] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

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

  return (
    <>
      <Modal
        centered={!isTablet}
        onClose={handleClose}
        opened={opened}
        title={<Title fz="1.25rem">Find Player by Clan</Title>}
      >
        {clan ? (
          <Group fw={600} gap="xs">
            <Image
              alt="Clan Badge"
              height={26}
              src={`/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.png`}
              unoptimized
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
                  key={m.tag}
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
      <Button onClick={open} size={isMobile ? "xs" : "sm"} variant="default" w="fit-content">
        Search by clan?
      </Button>
    </>
  )
}
