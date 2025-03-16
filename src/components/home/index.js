"use client"

import { Button, Card, Container, Divider, Group, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconBrandDiscord } from "@tabler/icons-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

import colors from "@/static/colors"

import Image from "../ui/image"
import classes from "./Home.module.css"
import LoginOverlay from "./loginOverlay"
import SavedItem from "./saved-item"
import SegmentedSearch from "./segmented-search"
import StarryBackground from "./starryBackground"

function HomeContainer({ children, ...props }) {
  return (
    <Container size="lg" w="100%" {...props}>
      {children}
    </Container>
  )
}

export default function Home() {
  const { data: session } = useSession()
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")
  const isLaptop = useMediaQuery("(max-width: 64em)")

  const savedCardSize = isLaptop ? "100%" : "28rem"

  const direction = isMobile ? "row" : "column"

  return (
    <Stack mt="-1rem">
      <StarryBackground direction={direction} />
      <Stack bg="gray.10" mt="-1rem">
        <HomeContainer py="3rem">
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
        </HomeContainer>
      </Stack>
      <Stack bg="gray.9" mt="-1rem">
        <Stack className="polka2">
          <HomeContainer py="3rem">
            <Group className={classes.stockPhotoContainer} gap={`3rem ${isTablet ? 8 : 10}rem`} justify="space-between">
              <Stack className={classes.discordPhotoText}>
                <Title fz="2.5rem">
                  Get the <span className="gradientText">Discord Bot</span>
                </Title>
                <Text c="gray.1" fw={500} fz={`${isMobile ? 1 : 1.25}rem`}>
                  Enhance your Discord community, and bring all the CWStats features you know and love directly to your
                  server!
                </Text>
                <Button
                  color={colors.discord}
                  component={Link}
                  href="/invite"
                  leftSection={<IconBrandDiscord />}
                  maw="10rem"
                  mt="1rem"
                  target="_blank"
                >
                  Invite to Server
                </Button>
              </Stack>

              <Image alt="iPhone Discord Bot" height={320} src="/assets/stock/iPhoneDiscordBot.webp" />
            </Group>
          </HomeContainer>
        </Stack>
      </Stack>
    </Stack>
  )
}
