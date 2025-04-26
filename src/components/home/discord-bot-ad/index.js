"use client"

import { Button, Container, Group, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconBrandDiscord } from "@tabler/icons-react"
import Link from "next/link"

import colors from "@/static/colors"

import Image from "../../ui/image"
import classes from "../Home.module.css"

export default function DiscordBotAd() {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  return (
    <Stack bg="gray.9" mt="-1rem">
      <Stack className="polka2">
        <Container py="3rem" size="lg" w="100%">
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
                prefetch={false}
                target="_blank"
              >
                Invite to Server
              </Button>
            </Stack>

            <Image alt="iPhone Discord Bot" height={320} src="/assets/stock/iPhoneDiscordBot.webp" />
          </Group>
        </Container>
      </Stack>
    </Stack>
  )
}
