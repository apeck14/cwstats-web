"use client"

import { ActionIcon, Button, Container, Divider, Group, Stack, Text, Title } from "@mantine/core"
import { useDebounceCallback, useMediaQuery } from "@mantine/hooks"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { PLAYER_IN_GAME_LINK } from "../../../../public/static/constants"
import { formatRole, getArenaFileName, getClanBadgeFileName } from "../../../lib/functions/utils"
import FollowButton from "../../ui/follow-button"
import Image from "../../ui/image"
import classes from "./header.module.css"

export default function HeaderContent({ clan, discordID, followPlayer, player, playerFollowed, unfollowPlayer }) {
  const router = useRouter()
  const pathname = usePathname()
  const [followed, setFollowed] = useState(playerFollowed)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const formattedTag = player?.tag?.substring(1)
  const inClan = !!player?.clan?.tag
  const itemFz = { base: "0.9rem", md: "1rem" }

  const activeTab = pathname.includes("/cards")
    ? "cards"
    : pathname.includes("/battles")
      ? "battles"
      : pathname.includes("/war")
        ? "war"
        : "home"

  const arena = getArenaFileName(player?.arena?.name)

  const updateFollowed = useDebounceCallback(() => {
    if (followed) followPlayer({ discordID, name: player?.name, tag: player?.tag })
    else unfollowPlayer({ discordID, tag: player?.tag })
  }, 1500)

  const handleFollowToggle = () => {
    // not logged in
    if (!discordID) router.push(`/login?callback=${pathname}`)
    else {
      updateFollowed()
      setFollowed(!followed)
    }
  }

  return (
    <Stack>
      <Stack className={classes.header}>
        <Container py="lg" size="lg" w="100%">
          <Group gap={isMobile ? "md" : "lg"}>
            <Image height={isMobile ? 40 : 60} src={`/assets/arenas/${arena}.png`} width={45} />
            <Stack gap="0.15rem" style={{ flex: "1 1 auto" }}>
              <Group justify="space-between">
                <Title fz={`${isMobile ? 1.5 : 2}rem`}>{player?.name}</Title>
                <FollowButton followed={followed} handleToggle={handleFollowToggle} showText />
                <Group gap="xs" hiddenFrom="md">
                  <FollowButton followed={followed} handleToggle={handleFollowToggle} />
                  <ActionIcon color="gray" variant="light">
                    <Link href={PLAYER_IN_GAME_LINK + formattedTag} target="_blank">
                      <IconExternalLink size={20} />
                    </Link>
                  </ActionIcon>
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap={isMobile ? "lg" : "xl"}>
                  <Text c="gray.1" fw={600} fz={itemFz}>
                    {player?.tag}
                  </Text>
                  <Group gap="xs">
                    <Image height={16} src="/assets/icons/trophy.png" width={14} />
                    <Text fw={600} fz={itemFz}>
                      {player?.trophies} / {player?.bestTrophies}
                    </Text>
                  </Group>
                  {player?.currentPathOfLegendSeasonResult?.leagueNumber === 10 && (
                    <Group gap="xs">
                      <Image height={16} src="/assets/icons/cw-trophy.png" />
                      <Text fw={600} fz={itemFz}>
                        {player?.currentPathOfLegendSeasonResult?.trophies}
                      </Text>
                    </Group>
                  )}
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Image
                    height={isMobile ? 20 : 24}
                    src={`/assets/badges/${getClanBadgeFileName(clan?.badgeId, clan?.clanWarTrophies)}.png`}
                  />
                  <Text
                    className={inClan ? "text" : ""}
                    component={inClan ? Link : Text}
                    fw={600}
                    fz={itemFz}
                    href={`/clan/${clan?.tag?.substring(1)}`}
                  >
                    {clan?.name || "None"}
                  </Text>
                  {inClan && (
                    <>
                      <Divider color="gray.7" h="1.25rem" m="auto" orientation="vertical" size="md" />
                      <Text c="gray.1" fw={600} fz={itemFz}>
                        {formatRole(player?.role)}
                      </Text>
                    </>
                  )}
                </Group>
                <Button
                  color="gray"
                  component={Link}
                  href={PLAYER_IN_GAME_LINK + formattedTag}
                  leftSection={<IconExternalLink size={20} />}
                  size="xs"
                  target="_blank"
                  variant="light"
                  visibleFrom="md"
                >
                  Open In-Game
                </Button>
              </Group>
            </Stack>
          </Group>
        </Container>
      </Stack>
      <Group bg="gray.10" mt="-1rem">
        <Container size="lg" w="100%">
          <Group gap="xs" py="0.5rem">
            <Link className={classes.link} data-active={activeTab === "home"} href={`/player/${formattedTag}`}>
              Home
            </Link>
            <Link className={classes.link} data-active={activeTab === "cards"} href={`/player/${formattedTag}/cards`}>
              Cards
            </Link>
            <Link
              className={classes.link}
              data-active={activeTab === "battles"}
              href={`/player/${formattedTag}/battles`}
            >
              Battles
            </Link>
            <Link className={classes.link} data-active={activeTab === "war"} href={`/player/${formattedTag}/war`}>
              War
            </Link>
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
