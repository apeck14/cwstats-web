"use client"

import { ActionIcon, Drawer, Group, Stack, Text } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconBrandDiscord, IconCompass, IconInfoCircle, IconMenu, IconMessageForward } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import classes from "./docs.module.css"

const links = [
  {
    icon: IconCompass,
    label: "Getting Started",
    url: "/getting-started",
  },
  {
    icon: IconBrandDiscord,
    label: "Bot Commands",
    url: "/bot-commands",
  },
  {
    icon: IconMessageForward,
    label: "Application System",
    url: "/application-system",
  },
  {
    icon: IconInfoCircle,
    label: "About",
    url: "/about",
  },
]

export default function SideBar() {
  const [opened, { close, open }] = useDisclosure(false)
  const showMenuBtn = useMediaQuery("(max-width: 95em)")
  const pathname = usePathname()

  if (showMenuBtn)
    return (
      <>
        <Drawer onClose={close} opened={opened} position="bottom" title="Table of Contents" zIndex={999}>
          {links.map((l) => (
            <Group
              className={classes.sideBarItem}
              component={Link}
              data-active={pathname.includes(l.url)}
              gap="sm"
              href={`/docs${l.url}`}
              key={l.label}
              mb="xs"
              onClick={close}
              p="xs"
            >
              <ActionIcon color="gray.8">
                <l.icon color="var(--mantine-color-orange-6)" size="1.25rem" />
              </ActionIcon>

              <Text fw="500">{l.label}</Text>
            </Group>
          ))}
        </Drawer>
        <ActionIcon
          aria-label="Open Side Bar Menu"
          className={classes.mobileSideBarBtn}
          hidden={!!opened}
          onClick={open}
          radius="xl"
          size="xl"
          variant="filled"
        >
          <IconMenu size="1.5rem" stroke={3} />
        </ActionIcon>
      </>
    )

  return (
    <Stack bg="gray.10" className={classes.sideBar} gap="0.25rem" h="100%" pos="fixed" px="xs" py="md" w="16rem">
      {links.map((l) => (
        <Group
          className={classes.sideBarItem}
          component={Link}
          data-active={pathname.includes(l.url)}
          gap="sm"
          href={`/docs${l.url}`}
          key={l.label}
          p="xs"
        >
          <ActionIcon color="gray.8">
            <l.icon color="var(--mantine-color-orange-6)" size="1.25rem" />
          </ActionIcon>

          <Text fw="500">{l.label}</Text>
        </Group>
      ))}
    </Stack>
  )
}
