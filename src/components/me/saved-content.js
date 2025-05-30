"use client"

import { Card, Container, Pagination, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"

import SavedItem from "./saved-item"

export default function SavedContent({ plusTags }) {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery("(max-width: 30em)")

  if (!session) {
    redirect("/login")
  }

  const isClans = !!plusTags
  const items = isClans
    ? session?.savedClans.map((c) => ({ ...c, isPlus: plusTags.includes(c.tag) })) || []
    : session?.savedPlayers || []

  const count = `${items.length} ${isClans ? "Clan" : "Player"}(s)`

  const start = 10 * (page - 1)
  const end = 10 * page

  return (
    <Container mb="md" mt={{ base: "3rem", lg: "8rem", md: "6rem" }} size="lg">
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

      <Card bg="gray.7" component={Stack} gap="xs" mih="47.75rem" mt="md" p="md" radius="md">
        {!items.length ? (
          <Text c="dimmed" fs="italic" fw="500" mt="5rem" ta="center">
            No saved {isClans ? "clans" : "players"}
          </Text>
        ) : (
          items
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(start, end)
            .map((i) => (
              <SavedItem
                discordID={session?.user?.discord_id}
                isClans={isClans}
                isMobile={isMobile}
                item={i}
                key={i.tag}
              />
            ))
        )}
      </Card>
    </Container>
  )
}
