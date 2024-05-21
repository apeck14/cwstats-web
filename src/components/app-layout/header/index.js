import { AppShell, Burger, Button, Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

import Image from "../../ui/image"
import AvatarDropdown from "./avatar"
import MobileMenu from "./mobile-menu"
import NavLinks from "./nav-links"

export default function Header({ opened, toggle }) {
  return (
    <AppShell.Header bg="gray.10" h={60} opacity="99%" px="sm">
      <Group align="center" h="100%" justify="space-between">
        <Group gap="xl" h="100%">
          <Group gap="xs">
            <Image alt="CWStats Logo" height={36} priority src="/assets/icons/logo.webp" />
            <Stack className="noselect" component={Link} gap={0} href="/">
              <Text fw={800} size="1.5rem">
                CWStats
              </Text>
              <Text c="pink.6" fw={800} fz="0.6rem" lh="1px" ta="right">
                BETA
              </Text>
            </Stack>
          </Group>
          <Group h="100%" visibleFrom="md">
            <NavLinks />
          </Group>
        </Group>

        <Group>
          <Button component={Link} href="/upgrade" radius="xl" size="xs" variant="gradient" visibleFrom="sm">
            Upgrade
          </Button>
          <AvatarDropdown />
          <Burger color="gray.1" hiddenFrom="sm" onClick={toggle} opened={opened} size="sm" />
        </Group>
        <MobileMenu open={opened} toggle={toggle} />
      </Group>
    </AppShell.Header>
  )
}
