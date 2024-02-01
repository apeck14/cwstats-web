"use client"

import { Container, Flex, Group, Skeleton, Stack, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconSpy } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { getClan, getPlayer, getPlayerBattleLog } from "../../actions/supercell"
import { getWarDecksFromLog } from "../../lib/functions/decks"
import { getClanBadgeFileName } from "../../lib/functions/utils"
import DebouncedSearch from "../ui/debounced-search"
import Image from "../ui/image"
import DeckContent from "./deck-content"
import SearchByClanModal from "./search-clan-modal"

export default function SpyContent() {
  const [decks, setDecks] = useState(null)
  const [player, setPlayer] = useState(null)
  const [decksLoading, setDecksLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  const handlePlayerSelect = async (selPlayer, selClan) => {
    if (player?.tag === selPlayer?.tag) return

    setShowSkeleton(true)
    setDecksLoading(true)
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

    setShowSkeleton(false)

    setPlayer({
      clan: {
        badge: getClanBadgeFileName(clanData.badgeId, clanData.clanWarTrophies),
        name: clanData.name,
        tag: clanData.tag,
      },
      name: selPlayer.name,
      tag: selPlayer.tag,
    })

    const { data: log } = await getPlayerBattleLog(selPlayer.tag, true)

    const decks = await getWarDecksFromLog(log)

    setDecksLoading(false)
    setDecks(decks)
  }

  return (
    <Flex className="circuit" mih="calc(100dvh - 3.75rem)" w="100%">
      <Container my={`${isMobile ? 3 : isTablet ? 5 : 10}rem`} pb="1rem" size="lg" w="100%">
        <Stack gap="xs">
          <Group>
            <IconSpy color="var(--mantine-color-pink-6)" size={`${isMobile ? 2.5 : 3.75}rem`} />
            <Title fz={`${isMobile ? 2.5 : 3.75}rem`}>Deck Spy</Title>
          </Group>
          <Group justify="space-between">
            <Title c="gray.2" fw={600} size={isMobile ? "h4" : "h3"}>
              View your opponent&apos;s decks in real-time!
            </Title>
            <SearchByClanModal onPlayerSelect={handlePlayerSelect} />
          </Group>

          <DebouncedSearch
            isClans={false}
            onSelect={handlePlayerSelect}
            searchIconSize={24}
            size={isMobile ? "md" : "lg"}
          />

          {(player || showSkeleton) && (
            <Stack fw={600} gap="0.15rem" mt="md">
              {showSkeleton ? (
                <Skeleton height="1.5rem" my="0.4rem" width="10rem" />
              ) : (
                <Link className="text" href={`/player/${player.tag.substring(1)}`} style={{ fontSize: "1.5rem" }}>
                  {player?.name}
                </Link>
              )}

              <Group gap="xs">
                {showSkeleton ? (
                  <Skeleton height={24} width={20} />
                ) : (
                  <Image
                    alt="Clan Badge"
                    height={24}
                    src={`/assets/badges/${player?.clan?.badge}.webp`}
                    unoptimized
                    width={12}
                  />
                )}

                {showSkeleton ? (
                  <Skeleton height="1rem" width="10rem" />
                ) : (
                  <Link
                    className="text"
                    href={player?.clan?.tag ? `/clan/${player.clan.tag.substring(1)}` : "/"}
                    style={{ color: "var(--mantine-color-gray-1)" }}
                  >
                    {player?.clan?.name}
                  </Link>
                )}
              </Group>
              {player && <DeckContent decks={decks} loading={decksLoading} />}
            </Stack>
          )}
        </Stack>
      </Container>
    </Flex>
  )
}
