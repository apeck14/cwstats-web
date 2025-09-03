"use client"

import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"
import { useEffect, useState } from "react"

import ProIcon from "../../ui/pro-icon"

const LATEST_ANNOUNCEMENT_ID = "2025-08-28"

export default function WhatsNewModal() {
  const [opened, setOpened] = useState(false)

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
      <Stack gap="xs" p="xs">
        <Group gap="xs">
          <Title size="h3">CWStats PRO</Title>
          <ProIcon />
        </Group>

        <Text>
          To combat increasing server costs to maintain CWStats, a NEW tier of perks has been added. Unlock the full
          power of CWStats with advanced features. See the full details{" "}
          <Link className="pinkText" color="pink" href="/upgrade" style={{ color: "var(--mantine-color-pink-6)" }}>
            here
          </Link>
          !
        </Text>
      </Stack>
      <Group justify="end" m={0}>
        <Button onClick={handleClose}>Got it!</Button>
      </Group>
    </Modal>
  )
}
