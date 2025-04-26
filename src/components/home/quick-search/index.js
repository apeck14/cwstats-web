"use client"

import { Card, Container, Divider, Group, Stack, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { useSession } from "next-auth/react"

import classes from "../Home.module.css"
import LoginOverlay from "./loginOverlay"
import SavedItem from "./saved-item"
import SegmentedSearch from "./segmented-search"

export default function QuickSearch() {
  const { data: session } = useSession()
  const isLaptop = useMediaQuery("(max-width: 64em)")

  const savedCardSize = isLaptop ? "100%" : "28rem"

  return (
    <Stack bg="gray.10" mt="-1rem">
      <Container py="3rem" size="lg" w="100%">
        <Stack>
          <Title size="h1">Quick Search</Title>
          <SegmentedSearch />
          <Group gap="2rem" grow justify="space-between" mt="3rem">
            <Stack miw={savedCardSize}>
              <Title className="text" component={Link} href="/me/clans" size="h2" w="fit-content">
                My Clans
              </Title>
              {session ? (
                <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                  {session?.savedClans.slice(0, 5).map((c, i) => (
                    <span key={c.tag}>
                      <SavedItem {...c} />
                      {i < 4 && <Divider color="gray.7" />}
                    </span>
                  ))}
                </Card>
              ) : (
                <LoginOverlay />
              )}
            </Stack>
            <Stack miw={savedCardSize}>
              <Title className="text" component={Link} href="/me/players" size="h2" w="fit-content">
                My Players
              </Title>
              {session ? (
                <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                  {session?.savedPlayers.slice(0, 5).map((p, i) => (
                    <span key={p.tag}>
                      <SavedItem {...p} />
                      {i < 4 && <Divider color="gray.7" />}
                    </span>
                  ))}
                </Card>
              ) : (
                <LoginOverlay />
              )}
            </Stack>
          </Group>
        </Stack>
      </Container>
    </Stack>
  )
}
