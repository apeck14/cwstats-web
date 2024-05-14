/* eslint-disable perfectionist/sort-objects */

"use client"

import { Button, Container, Divider, Group, Stack, Text } from "@mantine/core"
import { IconHeart } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import Image from "../ui/image"

const categories = {
  Tools: [
    { label: "Daily Leaderboard", url: "/leaderboard/daily/global" },
    { label: "War Leaderboard", url: "/leaderboard/war/global" },
    { label: "Spy", url: "/spy" },
    { label: "Decks", url: "/decks" },
  ],
  Help: [
    { label: "Docs", url: "/docs" },
    { label: "Invite", url: "/invite" },
    { label: "Support Server", url: "/support" },
  ],
}

export default function AppFooter() {
  const pathname = usePathname()
  return pathname === "/spy" ? null : (
    <Group bg="gray.10" py={{ base: "xl", md: "3rem" }}>
      <Container size="lg" w="100%">
        <Group align="top" gap="xl" justify="space-between">
          <Stack gap="0.2rem">
            <Group gap="0.25rem">
              <Image alt="CWStats Logo" height={32} src="/assets/icons/logo.webp" />
              <Text fw={700} fz="1.75rem">
                CWStats
              </Text>
            </Group>
            <Text c="gray.1" fw={500} size="sm">
              The trusted source for everything Clan Wars.
            </Text>
          </Stack>
          <Group align="top" gap="5rem">
            {Object.keys(categories).map((key) => {
              const links = categories[key]

              return (
                <Stack gap="0.2rem" key={key}>
                  <Text fw={700} size="lg">
                    {key}
                  </Text>
                  {links.map((l) => (
                    <Text
                      c="gray.1"
                      className="text"
                      component={Link}
                      fz="0.9rem"
                      href={l.url}
                      key={l.label}
                      target="_blank"
                      w="fit-content"
                    >
                      {l.label}
                    </Text>
                  ))}
                </Stack>
              )
            })}
          </Group>
        </Group>

        <Divider color="gray.7" my={{ base: "lg", md: "xl" }} size="sm" />

        <Group justify="space-between">
          <Text c="dimmed" fz={{ base: "xs", md: "sm" }}>
            ©2024 CWStats. All rights reserved.
          </Text>
          <Button component={Link} href="/donate" leftSection={<IconHeart size="1rem" />} size="xs" variant="light">
            Donate
          </Button>
        </Group>
      </Container>
    </Group>
  )
}
