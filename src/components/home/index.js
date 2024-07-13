"use client"

import { Button, Card, Container, Divider, Flex, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconBrandDiscord, IconClockBolt, IconTools } from "@tabler/icons-react"
import Link from "next/link"

import { CWSTATS_DESC } from "@/static/constants"

import Image from "../ui/image"
import classes from "./Home.module.css"
import LoginOverlay from "./loginOverlay"
import SavedItem from "./saved-item"
import SegmentedSearch from "./segmented-search"

function HomeContainer({ children, ...props }) {
  return (
    <Container size="lg" w="100%" {...props}>
      {children}
    </Container>
  )
}

export default function Home({ loggedIn, savedClans, savedPlayers }) {
  const isPhone = useMediaQuery("(max-width: 23.75em)")
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")
  const isLaptop = useMediaQuery("(max-width: 64em)")

  const savedCardSize = isLaptop ? "100%" : "28rem"
  const titleSize = isMobile ? 2.5 : isLaptop ? 4 : 6
  const titleYPadding = isMobile ? 4.5 : isTablet ? 6.5 : 8
  const subTitleSize = isPhone ? 1.1 : isMobile ? 1.15 : isTablet ? 1.3 : 1.5

  const direction = isMobile ? "row" : "column"
  const featureTitleSize = isMobile ? 1.2 : 1.5

  return (
    <Stack mt="-1rem">
      <Stack className="circuit" py={`${titleYPadding}rem`}>
        <HomeContainer>
          <Stack gap="xl">
            <Title className={classes.title} fw={800} fz={`${titleSize}rem`}>
              The trusted source for everything <span className="gradientText">Clan Wars</span>
            </Title>
            <Title c="gray.2" fw={500} fz={`${subTitleSize}rem`}>
              {CWSTATS_DESC}
            </Title>

            <Flex direction={isMobile ? "column" : "row"} gap="xl" pt="xl">
              <Flex direction={direction} gap="sm">
                <ThemeIcon size="xl" variant="gradient">
                  <IconBrandDiscord />
                </ThemeIcon>
                <Flex direction="column">
                  <Title fz={`${featureTitleSize}rem`}>Discord Bot</Title>
                  <Text c="gray.1" fw={500}>
                    Bring the analytics you love directly to your Discord servers
                  </Text>
                </Flex>
              </Flex>
              <Flex direction={direction} gap="sm">
                <ThemeIcon size="xl" variant="gradient">
                  <IconClockBolt />
                </ThemeIcon>
                <Flex direction="column">
                  <Title fz={`${featureTitleSize}rem`}>Real-Time Data</Title>
                  <Text c="gray.1" fw={500}>
                    Foster quick, informed decisions to maximize your clan&apos;s success
                  </Text>
                </Flex>
              </Flex>
              <Flex direction={direction} gap="sm">
                <ThemeIcon size="xl" variant="gradient">
                  <IconTools />
                </ThemeIcon>
                <Flex direction="column">
                  <Title fz={`${featureTitleSize}rem`}>CW2 Tools</Title>
                  <Text c="gray.1" fw={500}>
                    Explore cutting-edge tools to always give you and your clan the advantage
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Stack>
        </HomeContainer>
      </Stack>
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
                {loggedIn ? (
                  <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                    {savedClans.slice(0, 5).map((c, i) => (
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
                {loggedIn ? (
                  <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                    {savedPlayers.slice(0, 5).map((p, i) => (
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
                  color="#7289da"
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
