"use client"

import { ActionIcon, Button, Container, Group, Stack, Text, Title } from "@mantine/core"
import { useDebounceCallback } from "@mantine/hooks"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { CLAN_IN_GAME_LINK } from "../../../../public/static/constants"
import { getClanBadgeFileName } from "../../../lib/functions"
import Image from "../../ui/image"
import FollowButton from "./follow-button"
import classes from "./header.module.css"

export default function HeaderContent({ clan, clanFollowed, discordID, followClan, unfollowClan, url }) {
  const [followed, setFollowed] = useState(clanFollowed)
  const activeTab = url.includes("/race")
    ? "race"
    : url.includes("/log")
      ? "log"
      : url.includes("/plus")
        ? "plus"
        : "home"

  const badge = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

  const updateFollowed = useDebounceCallback(() => {
    if (followed) followClan({ badge, discordID, name: clan.name, tag: clan.tag })
    else unfollowClan({ discordID, tag: clan.tag })
  }, 1500)

  const handleFollowToggle = () => {
    updateFollowed()
    setFollowed(!followed)
  }

  return (
    <Stack>
      <Stack className={classes.header}>
        <Container py="lg" size="lg" w="100%">
          <Group gap="xl">
            <Image height={60} src={`/assets/badges/${badge}.png`} width={36} />
            <Stack gap="xs" style={{ flex: "1 1 auto" }}>
              <Group justify="space-between">
                <Title>{clan.name}</Title>
                <FollowButton followed={followed} handleToggle={handleFollowToggle} showText />
                <Group gap="xs" hiddenFrom="md">
                  <FollowButton followed={followed} handleToggle={handleFollowToggle} />
                  <ActionIcon color="gray" variant="light">
                    <Link href={CLAN_IN_GAME_LINK + clan.tag.substring(1)} target="_blank">
                      <IconExternalLink size={20} />
                    </Link>
                  </ActionIcon>
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap="xl">
                  <Text fw={600}>{clan.tag}</Text>
                  <Group gap="xs">
                    <Image height={16} src="/assets/icons/trophy.png" width={14} />
                    <Text fw={600}>{clan.clanScore}</Text>
                  </Group>
                  <Group gap="xs">
                    <Image height={16} src="/assets/icons/cw-trophy.png" width={14} />
                    <Text fw={600}>{clan.clanWarTrophies}</Text>
                  </Group>
                </Group>

                <Link href={CLAN_IN_GAME_LINK + clan.tag.substring(1)} target="_blank">
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
            <Link className={classes.link} data-active={activeTab === "home"} href="/">
              Home
            </Link>
            <Link className={classes.link} data-active={activeTab === "race"} href="/">
              Race
            </Link>
            <Link className={classes.link} data-active={activeTab === "log"} href="/">
              Log
            </Link>
            <Link className={classes.link} data-active={activeTab === "plus"} href="/">
              Plus
            </Link>
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
