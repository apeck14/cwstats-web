import { Flex, Group, Paper, Text } from "@mantine/core"
import { useDebouncedCallback } from "@mantine/hooks"
import Link from "next/link"
import { useState } from "react"

import { followClan, followPlayer, unfollowClan, unfollowPlayer } from "@/actions/user"

import FollowButton from "../ui/follow-button"
import Image from "../ui/image"

export default function SavedItem({ discordID, isClans, isMobile, item }) {
  const [followed, setFollowed] = useState(true)

  const toggleFollow = useDebouncedCallback(() => {
    if (followed) {
      if (isClans) followClan({ badge: item.badge, discordID, name: item.name, tag: item.tag })
      else followPlayer({ discordID, name: item.name, tag: item.tag })
    } else if (isClans) unfollowClan({ discordID, tag: item.tag })
    else unfollowPlayer({ discordID, tag: item.tag })
  }, 1500)

  const handleToggle = () => {
    setFollowed(!followed)
    toggleFollow()
  }

  const baseUrl = `/${isClans ? "clan" : "player"}`

  return (
    <Paper bg="gray.8" key={item.tag} p="md" radius="sm">
      <Flex direction={isMobile ? "column" : "row"} gap="xs">
        <Group gap="xs" style={{ flex: 1 }}>
          <Image
            alt={item.badge}
            height={isMobile ? 28 : 32}
            src={isClans ? `/assets/badges/${item.badge}.webp` : `/assets/icons/king-pink.webp`}
          />
          <Text className="pinkText" component={Link} fw="600" href={`${baseUrl}/${item.tag.substring(1)}`}>
            {item.name}
          </Text>

          {isClans && item.isPlus && <Image alt="CWStats+" height={isMobile ? 12 : 16} src="/assets/icons/plus.webp" />}
        </Group>

        <Group style={{ flex: 1 }}>
          <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
            <Text
              className="pinkText"
              component={Link}
              fw="600"
              href={`${baseUrl}/${item.tag.substring(1)}/${isClans ? "race" : "battles"}`}
            >
              {isClans ? "Race" : "Battles"}
            </Text>
          </div>

          <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
            <Text
              className="pinkText"
              component={Link}
              fw="600"
              href={`${baseUrl}/${item.tag.substring(1)}/${isClans ? "log" : "cards"}`}
            >
              {isClans ? "Log" : "Cards"}
            </Text>
          </div>

          <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
            <Text
              className="pinkText"
              component={Link}
              fw="600"
              href={`${baseUrl}/${item.tag.substring(1)}/${isClans ? "plus/daily-tracking" : "war"}`}
            >
              {isClans ? "Plus" : "War"}
            </Text>
          </div>

          <FollowButton followed={followed} handleToggle={handleToggle} />
        </Group>
      </Flex>
    </Paper>
  )
}
