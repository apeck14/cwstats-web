"use client"

import { Container, Group } from "@mantine/core"
import { usePathname } from "next/navigation"

export default function AppFooter() {
  const pathname = usePathname()
  return pathname === "/spy" ? null : (
    <Group bg="gray.10" py="3rem">
      <Container size="lg">
        <Group>Footer Placeholder</Group>
      </Container>
    </Group>
  )
}
