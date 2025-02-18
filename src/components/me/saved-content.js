"use client"

import { Card, Container, Flex, Group, Pagination, Paper, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { useState } from "react"

import Image from "../ui/image"

export default function SavedContent({ items }) {
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const isClans = Object.prototype.hasOwnProperty.call(items[0] || {}, "badge")

  const baseUrl = `/${isClans ? "clan" : "player"}`
  const count = `${items.length} ${isClans ? "Clan" : "Player"}(s)`

  const start = 10 * (page - 1)
  const end = 10 * page

  return (
    <Container pt={{ base: "3rem", md: "10rem" }} size="lg">
      <Title size="2.5rem">My {isClans ? "Clans" : "Players"}</Title>

      <Stack align="end">
        <Pagination
          disabled={items.length === 0}
          onChange={setPage}
          size={isMobile ? "xs" : "sm"}
          total={items.length === 0 ? 1 : Math.ceil(items.length / 10)}
          value={page}
        />
        <Text c="dimmed" fw="600" size="xs">
          {count}
        </Text>
      </Stack>

      <Card bg="gray.7" component={Stack} gap="xs" mih="47.75rem" my="md" p="md" radius="md">
        {items
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(start, end)
          .map((i) => (
            <Paper bg="gray.8" key={i.tag} p="md" radius="sm">
              <Flex direction={isMobile ? "column" : "row"} gap="xs">
                <Group gap="xs" style={{ flex: 1 }}>
                  <Image
                    alt={i.badge}
                    height={isMobile ? 28 : 32}
                    src={isClans ? `/assets/badges/${i.badge}.webp` : `/assets/icons/king-pink.webp`}
                  />
                  <Text className="pinkText" component={Link} fw="600" href={`${baseUrl}/${i.tag.substring(1)}`}>
                    {i.name}
                  </Text>

                  {isClans && i.isPlus && (
                    <Image alt="CWStats+" height={isMobile ? 12 : 16} src="/assets/icons/plus.webp" />
                  )}
                </Group>

                <Group style={{ flex: 1 }}>
                  <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
                    <Text
                      className="pinkText"
                      component={Link}
                      fw="600"
                      href={`${baseUrl}/${i.tag.substring(1)}/${isClans ? "race" : "battles"}`}
                    >
                      {isClans ? "Race" : "Battles"}
                    </Text>
                  </div>

                  <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
                    <Text
                      className="pinkText"
                      component={Link}
                      fw="600"
                      href={`${baseUrl}/${i.tag.substring(1)}/${isClans ? "log" : "cards"}`}
                    >
                      {isClans ? "Log" : "Cards"}
                    </Text>
                  </div>

                  <div style={{ color: "var(--mantine-color-gray-1)", flex: 1 }}>
                    <Text
                      className="pinkText"
                      component={Link}
                      fw="600"
                      href={`${baseUrl}/${i.tag.substring(1)}/${isClans ? "plus/daily-tracking" : "war"}`}
                    >
                      {isClans ? "Plus" : "War"}
                    </Text>
                  </div>
                </Group>
              </Flex>
            </Paper>
          ))}
      </Card>
    </Container>
  )
}
