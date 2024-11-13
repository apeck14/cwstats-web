"use client"

import { Container, Group, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { truncateString } from "@/lib/functions/utils"

import classes from "../../clan/header/header.module.css"
import DiscordServerIcon from "../discord-server-icon"

const tabs = [
  {
    isActive: (path, id) => id.length + path.indexOf(id) === path.length,
    key: "home",
    label: "Home",
    url: (id) => `/me/servers/${id}`,
  },
  {
    isActive: (path) => path.includes("clans"),
    key: "clans",
    label: "Clans",
    url: (id) => `/me/servers/${id}/clans`,
  },
  {
    isActive: (path) => path.includes("players"),
    key: "players",
    label: "Players",
    url: (id) => `/me/servers/${id}/players`,
  },
  {
    isActive: (path) => path.includes("nudges"),
    key: "nudges",
    label: "Nudges",
    url: (id) => `/me/servers/${id}/nudges`,
  },
]

export default function ServerHeaderContent({ guild }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const pathname = usePathname()

  return (
    <Stack className="header">
      <Container py="xl" size="lg" w="100%">
        <Stack>
          <Group wrap="nowrap">
            <DiscordServerIcon height={isMobile ? 60 : 80} icon={guild.icon} id={guild.id} name={guild.name} />
            <Stack gap="0.2rem">
              <Title fz={{ base: "1.5rem", md: "2.5rem" }}>
                {isMobile ? truncateString(guild.name, 20) : guild.name}
              </Title>
              <Text c="gray.1" fw={500} fz={{ base: "0.9rem", md: "1.25rem" }}>
                Manage your server&apos;s CWStats settings!
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Container>
      <Group bg="gray.10" mt="-1rem">
        <Container size="lg" w="100%">
          <Group gap="xs" py="0.5rem">
            {tabs.map((t) => (
              <Link
                className={classes.link}
                data-active={t.isActive(pathname, guild.id)}
                href={t.url(guild.id)}
                key={t.key}
              >
                {t.label}
              </Link>
            ))}
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
