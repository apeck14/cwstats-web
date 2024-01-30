"use client"

import { ActionIcon, Button, Group, Stack, Text } from "@mantine/core"
import Link from "next/link"
import { usePathname } from "next/navigation"

import classes from "./header.module.css"
import { links } from "./nav-links"

export default function MobileMenu({ open, toggle }) {
  const pathname = usePathname()
  return (
    <Stack
      align="space-between"
      className={classes.mobileMenu}
      gap="xs"
      h="calc(100% - 3.75rem)"
      mod={{ open }}
      w="85dvw"
    >
      {links.map((l) => (
        <Group
          bg={pathname.includes(l.query) ? "gray.7" : "transparent"}
          className={classes.mobileNavItem}
          component={Link}
          gap="sm"
          href={l.link}
          onClick={toggle}
          p="sm"
        >
          <ActionIcon color="pink" variant="light">
            {l.icon}
          </ActionIcon>
          <Text fw={600}>{l.label}</Text>
        </Group>
      ))}
      <Button className={classes.mobuleUpgradeBtn} component={Link} href="/upgrade" onClick={toggle} variant="gradient">
        Upgrade
      </Button>
    </Stack>
  )
}
