"use client"

import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import AppHeader from "./header"

export default function AppLayout({ children }) {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell bg="gray.9" className={opened ? "hiddenOverflow" : ""} withBorder={false}>
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Main pt="3.75rem">{children}</AppShell.Main>
    </AppShell>
  )
}
