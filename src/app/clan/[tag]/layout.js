"use client"

import { Container, Group, Stack } from "@mantine/core"
import Link from "next/link"
import { usePathname } from "next/navigation"

import classes from "../clan.module.css"

export default function ClanLayout({ children }) {
  const pathname = usePathname()

  return (
    <Container mt="-1rem" size="lg">
      <Stack className={classes.header} h="10rem" />
      <Group p="xs">
        <Link className={pathname.includes("/")} href="/">
          Home
        </Link>
        <Link href="/">Race</Link>
        <Link href="/">Log</Link>
        <Link href="/">CWStats+</Link>
      </Group>
      {children}
    </Container>
  )
}
