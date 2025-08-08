"use client"

import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useEffect, useState } from "react"

import Image from "../../ui/image"

const LATEST_ANNOUNCEMENT_ID = "2025-08-07"

export default function WhatsNewModal() {
  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  useEffect(() => {
    const lastSeen = localStorage.getItem("whatsNewLastSeen")
    if (lastSeen !== LATEST_ANNOUNCEMENT_ID) {
      setOpened(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("whatsNewLastSeen", LATEST_ANNOUNCEMENT_ID)
    setOpened(false)
  }

  return (
    <Modal onClose={handleClose} opened={opened} size="lg" title={<Title size="h2">What&apos;s New? 🎉</Title>}>
      <Stack gap="0" p="xs">
        <Title size="h4" td="underline">
          War Logs
        </Title>

        <Text>
          War Logs let you track your clan’s battles in near real-time, automatically sending every single, duel, and
          boat battle to your chosen Discord channel. <strong>Limited to 1 plus clan per server.</strong> Enable them
          from your server&apos;s dashboard.
        </Text>

        <Stack align="center" my="-2rem">
          <Image alt="What's New?" height={isMobile ? 300 : isTablet ? 400 : 500} src="/assets/whatsNew.webp" />
        </Stack>
      </Stack>
      <Group justify="end" m={0}>
        <Button onClick={handleClose}>Got it</Button>
      </Group>
    </Modal>
  )
}
