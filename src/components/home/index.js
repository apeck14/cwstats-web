/* eslint-disable perfectionist/sort-objects */

"use client"

import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  rem,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { IconBrandDiscord, IconSearch } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { DISCORD_BOT_INVITE } from "../../../public/static/constants"
import useWindowSize from "../../hooks/useWindowSize"
import { breakpointObj } from "../../lib/functions"
import Image from "../ui/image"
import FeatureIcons from "./feature-icons"
import classes from "./Home.module.css"
import LoginOverlay from "./loginOverlay"
import SavedItem from "./saved-item"

function HomeContainer({ children, ...props }) {
  return (
    <Container size="lg" w="100%" {...props}>
      {children}
    </Container>
  )
}

export default function Home({ loggedIn, savedClans, savedPlayers }) {
  const { breakpoint } = useWindowSize()
  const router = useRouter()
  const [currentSegment, setCurrentSegment] = useState("Clans")
  const onSegmentChange = (val) => {
    setCurrentSegment(val)
  }

  const savedCardSize = breakpointObj("100%", "100%", "100%", "100%", "28rem")[breakpoint]
  const titleSize = `${breakpointObj(2.5, 2.5, 3.5, 4.5, 6)[breakpoint]}rem`

  return (
    <Stack mt="-1rem">
      <Stack className="circuit" py={`${breakpointObj(4.5, 5, 6.5, 8)[breakpoint]}rem`}>
        <HomeContainer>
          <Stack gap="xl">
            <Title className={classes.title} fw={800} fz={titleSize}>
              The trusted source for everything <span className="gradientText">Clan Wars</span>
            </Title>
            <Title c="gray.2" fw={500} fz={`${breakpointObj(1.1, 1.15, 1.3, 1.5)[breakpoint]}rem`}>
              Unleash the power of analytics, dive into comprehensive insights, strategize with precision, and elevate
              your clan&apos;s CW2 expierence with real-time data &mdash; trusted by 2500+ of the most competitive CW2
              clans
            </Title>

            <FeatureIcons breakpoint={breakpoint} />
          </Stack>
        </HomeContainer>
      </Stack>
      <Stack bg="gray.10" mt="-1rem">
        <HomeContainer py="3rem">
          <Stack>
            <Title size="h1">Quick Search</Title>
            <SegmentedControl
              color={currentSegment === "Clans" ? "pink" : "#FFA500"}
              data={["Clans", "Players"]}
              onChange={onSegmentChange}
              radius="sm"
              size="xs"
              w="8rem"
            />
            <TextInput
              color="pink"
              leftSection={<IconSearch stroke={1.5} style={{ height: rem(18), width: rem(18) }} />}
              placeholder="Search by name or tag, e.g. ABC123"
              size="md"
              w="100%"
            />
            <Group gap="2rem" grow justify="space-between" mt="3rem">
              <Stack miw={savedCardSize}>
                <Title size="h2">My Clans</Title>
                {loggedIn ? (
                  <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                    {savedClans.slice(0, 5).map((c, i) => (
                      <>
                        <SavedItem key={c.tag} {...c} />
                        {i < 4 && <Divider color="gray.7" key={`${c.tag}-d`} />}
                      </>
                    ))}
                  </Card>
                ) : (
                  <LoginOverlay />
                )}
              </Stack>
              <Stack miw={savedCardSize}>
                <Title size="h2">My Players</Title>
                {loggedIn ? (
                  <Card bg="transparent" className={classes.card} h="23.25rem" p={0} withBorder>
                    {savedPlayers.slice(0, 5).map((p, i) => (
                      <>
                        <SavedItem key={p.tag} {...p} />
                        {i < 4 && <Divider color="gray.7" key={`${p.tag}-d`} />}
                      </>
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
          <HomeContainer key="3" py="3rem">
            <Group
              className={classes.stockPhotoContainer}
              gap={`3rem ${breakpointObj(8, 8, 8, 10)[breakpoint]}rem`}
              justify="space-between"
            >
              <Stack className={classes.discordPhotoText}>
                <Title fz="2.5rem">
                  Get the <span className="gradientText">Discord Bot</span>
                </Title>
                <Text c="gray.1" fw={500} fz={`${breakpointObj(1, 1, 1.25)[breakpoint]}rem`}>
                  Enhance your Discord community, and bring all the CWStats features you know and love directly to your
                  server!
                </Text>
                <Button
                  color="#7289da"
                  leftSection={<IconBrandDiscord />}
                  maw="10rem"
                  mt="1rem"
                  onClick={() => router.push(DISCORD_BOT_INVITE)}
                >
                  Invite to Server
                </Button>
              </Stack>

              <Image height={1000} src="/assets/stock/iPhoneDiscordBot.webp" width={1000} />
            </Group>
          </HomeContainer>
        </Stack>
      </Stack>
    </Stack>
  )
}
