"use client"

import { ActionIcon, Button, Container, Group, Stack, Text, Title } from "@mantine/core"
import { useDebounceCallback, useMediaQuery } from "@mantine/hooks"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { CLAN_IN_GAME_LINK } from "../../../../public/static/constants"
import { getClanBadgeFileName } from "../../../lib/functions/utils"
import FollowButton from "../../ui/follow-button"
import Image from "../../ui/image"
import classes from "./header.module.css"

export default function HeaderContent({ clan, clanFollowed, discordID, followClan, unfollowClan }) {
  const router = useRouter()
  const pathname = usePathname()
  const [followed, setFollowed] = useState(clanFollowed)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const formattedTag = clan?.tag.substring(1)

  const activeTab = pathname.includes("/race")
    ? "race"
    : pathname.includes("/log")
      ? "log"
      : pathname.includes("/stats")
        ? "stats"
        : "home"

  const badge = getClanBadgeFileName(clan?.badgeId, clan?.clanWarTrophies)

  const updateFollowed = useDebounceCallback(() => {
    if (followed) followClan({ badge, discordID, name: clan?.name, tag: clan?.tag })
    else unfollowClan({ discordID, tag: clan?.tag })
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
      <Stack className="header">
        <Container py="lg" size="lg" w="100%">
          <Group gap={isMobile ? "md" : "lg"}>
            <Image height={isMobile ? 40 : 60} src={`/assets/badges/${badge}.png`} width={45} />
            <Stack gap="xs" style={{ flex: "1 1 auto" }}>
              <Group justify="space-between">
                <Title fz={`${isMobile ? 1.5 : 2}rem`}>{clan?.name}</Title>
                <FollowButton followed={followed} handleToggle={handleFollowToggle} showText />
                <Group gap="xs" hiddenFrom="md">
                  <FollowButton followed={followed} handleToggle={handleFollowToggle} />
                  <ActionIcon color="gray" variant="light">
                    <Link href={CLAN_IN_GAME_LINK + formattedTag} target="_blank">
                      <IconExternalLink size={20} />
                    </Link>
                  </ActionIcon>
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap={isMobile ? "lg" : "xl"}>
                  <Text fw={600}>{clan?.tag}</Text>
                  <Group gap="xs">
                    <Image height={16} src="/assets/icons/trophy.png" width={14} />
                    <Text fw={600}>{clan?.clanScore}</Text>
                  </Group>
                  <Group gap="xs">
                    <Image height={16} src="/assets/icons/cw-trophy.png" width={14} />
                    <Text fw={600}>{clan?.clanWarTrophies}</Text>
                  </Group>
                </Group>

                <Link href={CLAN_IN_GAME_LINK + formattedTag} target="_blank">
                  <Button
                    color="gray"
                    leftSection={<IconExternalLink size={20} />}
                    size="xs"
                    variant="light"
                    visibleFrom="md"
                  >
                    Open In-Game
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Group>
        </Container>
      </Stack>
      <Group bg="gray.10" mt="-1rem">
        <Container size="lg" w="100%">
          <Group gap="xs" py="0.5rem">
            <Link className={classes.link} data-active={activeTab === "home"} href={`/clan/${formattedTag}`}>
              Home
            </Link>
            <Link className={classes.link} data-active={activeTab === "race"} href={`/clan/${formattedTag}/race`}>
              Race
            </Link>
            <Link className={classes.link} data-active={activeTab === "log"} href={`/clan/${formattedTag}/log`}>
              Log
            </Link>
            <Link className={classes.link} data-active={activeTab === "stats"} href={`/clan/${formattedTag}/stats`}>
              Stats
            </Link>
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
