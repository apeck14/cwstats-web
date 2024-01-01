"use client"

import { Container, Flex, Group, Stack, Title } from "@mantine/core"
import { IconSpy } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { getClan, getPlayer, getPlayerBattleLog } from "../../actions/supercell"
import DeckContent from "../../components/spy/deck-content"
import SearchByClanModal from "../../components/spy/search-clan-modal"
import DebouncedSearch from "../../components/ui/debounced-search"
import Image from "../../components/ui/image"
import useWindowSize from "../../hooks/useWindowSize"
import { getWarDecksFromLog } from "../../lib/decks"
import { breakpointObj, getClanBadgeFileName } from "../../lib/functions"

export default function SpyPage() {
  const { breakpoint } = useWindowSize()
  const [decks, setDecks] = useState(null)
  const [player, setPlayer] = useState(null)
  const [decksLoading, setDecksLoading] = useState(false)

  const handlePlayerSelect = async (selPlayer, selClan) => {
    if (player?.tag === selPlayer?.tag) return

    setPlayer(null)
    let clanData = selClan

    if (!selClan) {
      // if no clan given, 1. get player 2. get clan
      const { data: playerResp } = await getPlayer(selPlayer.tag)

      if (!playerResp?.clan) clanData = { badgeId: -1, name: "None" }
      else {
        const { data: clanResp } = await getClan(playerResp.clan.tag)
        clanData = clanResp
      }
    }

    setPlayer({
      clan: {
        badge: getClanBadgeFileName(clanData.badgeId, clanData.clanWarTrophies),
        name: clanData.name,
        tag: clanData.tag,
      },
      name: selPlayer.name,
      tag: selPlayer.tag,
    })

    setDecksLoading(true)

    const { data: log } = await getPlayerBattleLog(selPlayer.tag)

    // TODO: handle error (maybe gloabl error handler)

    const decks = await getWarDecksFromLog(log)

    setDecksLoading(false)
    setDecks(decks)
  }

  return (
    <Flex className="circuit" mih="calc(100dvh - 3.75rem)" w="100%">
      <Container my={`${breakpointObj(3, 3, 5, 10)[breakpoint]}rem`} pb="1rem" size="lg" w="100%">
        <Stack gap="xs">
          <Group>
            <IconSpy color="var(--mantine-color-pink-6)" size={`${breakpointObj(2.5, 2.5, 3.75)[breakpoint]}rem`} />
            <Title fz={`${breakpointObj(2.5, 2.5, 3.75)[breakpoint]}rem`}>Deck Spy</Title>
          </Group>
          <Group justify="space-between">
            <Title c="gray.2" fw={600} size={breakpointObj("h4", "h4", "h3")[breakpoint]}>
              View your opponent&apos;s decks in real-time!
            </Title>
            <SearchByClanModal onPlayerSelect={handlePlayerSelect} />
          </Group>

          <DebouncedSearch
            isClans={false}
            onSelect={handlePlayerSelect}
            searchIconSize={24}
            size={breakpointObj("md", "md", "lg")[breakpoint]}
          />

          {player && (
            <Stack fw={600} gap="0.15rem" mt="md">
              <Link className="text" href="/" style={{ fontSize: "1.5rem" }}>
                {player.name}
              </Link>
              <Group gap="xs">
                <Image height={24} src={`/assets/badges/${player.clan.badge}.png`} width={12} />
                <Link
                  className="text"
                  href={player.clan.tag ? `/clan/${player.clan.tag.substring(1)}` : "/"}
                  style={{ color: "var(--mantine-color-gray-1)" }}
                >
                  {player.clan.name}
                </Link>
              </Group>

              <DeckContent decks={decks} loading={decksLoading} />
            </Stack>
          )}
        </Stack>
      </Container>
    </Flex>
  )
}
