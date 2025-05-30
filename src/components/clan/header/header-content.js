"use client"

import { ActionIcon, Button, Container, Group, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery, useThrottledCallback } from "@mantine/hooks"
import { IconBrandDiscordFilled, IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import PlusIcon from "@/components/ui/plus-icon"
import { getClanBadgeFileName } from "@/lib/functions/utils"
import colors from "@/static/colors"
import { CLAN_IN_GAME_LINK } from "@/static/constants"

import FollowButton from "../../ui/follow-button"
import Image from "../../ui/image"
import classes from "./header.module.css"
import MobileActionsMenu from "./mobile-actions-popover"
import PlusDropdown from "./plus-dropdown"

export default function HeaderContent({ clan, discordInviteCode, followClan, isPlus, unfollowClan }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [followed, setFollowed] = useState(session?.savedClans?.find((c) => c.tag === clan?.tag))
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isLessThanTablet = useMediaQuery("(max-width: calc(48em - 1px))")

  const discordID = session?.user?.discord_id
  const formattedTag = clan?.tag.substring(1)

  const activeTab = pathname.includes("/race")
    ? "race"
    : pathname.includes("/log")
      ? "log"
      : pathname.includes("/stats")
        ? "stats"
        : pathname.includes("/plus")
          ? "plus"
          : "home"

  const badge = getClanBadgeFileName(clan?.badgeId, clan?.clanWarTrophies)

  const updateFollowed = useThrottledCallback((newFollowed) => {
    if (newFollowed) followClan({ badge, discordID, name: clan?.name, tag: clan?.tag })
    else unfollowClan({ discordID, tag: clan?.tag })
  }, 1500)

  const handleFollowToggle = () => {
    // not logged in
    if (!discordID) router.push(`/login?callback=${pathname}`)
    else {
      updateFollowed(!followed)
      setFollowed(!followed)
    }
  }

  return (
    <Stack>
      <Stack className="header">
        <Container py="lg" size="lg" w="100%">
          <Group gap={isMobile ? "md" : "lg"}>
            <Image
              alt="Badge"
              height={isMobile ? 40 : 60}
              src={`/assets/badges/${badge}.webp`}
              unoptimized
              visible={!isMobile}
            />
            <Stack gap="xs" style={{ flex: "1 1 auto" }}>
              <Group gap={isMobile ? "xs" : "md"} justify="space-between">
                <Group gap={isMobile ? "xs" : "md"}>
                  {isMobile && <Image alt="Badge" height={30} src={`/assets/badges/${badge}.webp`} unoptimized />}
                  <Title fz={`${isMobile ? 1.5 : 2}rem`}>{clan?.name}</Title>
                  <PlusIcon isPlus={isPlus} size={isMobile ? 20 : 24} tag={formattedTag} />
                  {!isMobile && discordInviteCode && (
                    <ActionIcon
                      component={Link}
                      href={`https://discord.gg/${discordInviteCode}`}
                      target="_blank"
                      variant="transparent"
                    >
                      <IconBrandDiscordFilled color={colors.discord} size="1.25rem" stroke={2} />
                    </ActionIcon>
                  )}
                </Group>
                <FollowButton followed={followed} handleToggle={handleFollowToggle} showText />
                {isLessThanTablet && (
                  <MobileActionsMenu followed={followed} handleFollowToggle={handleFollowToggle} tag={formattedTag} />
                )}
              </Group>
              <Group justify="space-between">
                <Group c="gray.2" gap={isMobile ? "lg" : "xl"}>
                  <Text fw={700}>{clan?.tag}</Text>
                  <Group gap="xs">
                    <Image alt="Trophy" height={16} src="/assets/icons/trophy.webp" />
                    <Text fw={700}>{clan?.clanScore}</Text>
                  </Group>
                  <Group gap="xs">
                    <Image alt="CW Trophy" height={16} src="/assets/icons/cw-trophy.webp" />
                    <Text fw={700}>{clan?.clanWarTrophies}</Text>
                  </Group>
                </Group>

                {isMobile && discordInviteCode && (
                  <ActionIcon
                    component={Link}
                    href={`https://discord.gg/${discordInviteCode}`}
                    mr="-0.1rem"
                    target="_blank"
                    variant="transparent"
                  >
                    <IconBrandDiscordFilled color={colors.discord} size="1.25rem" stroke={2} />
                  </ActionIcon>
                )}

                <Button
                  color="gray"
                  component={Link}
                  href={CLAN_IN_GAME_LINK + formattedTag}
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
            <Link className={classes.link} data-active={activeTab === "home"} href={`/clan/${formattedTag}`}>
              Home
            </Link>
            <Link className={classes.link} data-active={activeTab === "race"} href={`/clan/${formattedTag}/race`}>
              Race
            </Link>
            <Link className={classes.link} data-active={activeTab === "log"} href={`/clan/${formattedTag}/log`}>
              Log
            </Link>
            <PlusDropdown active={activeTab === "plus"} tag={formattedTag} />
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
