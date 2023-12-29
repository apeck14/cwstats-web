"use client"

import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import AppHeader from "./header"

export default function AppLayout({ children }) {
  const [opened] = useDisclosure(false)

  return (
    <AppShell
      bg="gray.9"
      header={{
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <AppHeader />
      <AppShell.Main pt="3.75rem">{children}</AppShell.Main>
    </AppShell>
  )
}
