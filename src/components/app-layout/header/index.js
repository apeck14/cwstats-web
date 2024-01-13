import { AppShell, Button, Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

import Image from "../../ui/image"
import AvatarDropdown from "./avatar"
import NavLinks from "./nav-links"

export default function Header() {
  return (
    <AppShell.Header bg="gray.10" h={60} px="sm">
      <Group align="center" h="100%" justify="space-between">
        <Group gap="xl" h="100%">
          <Group gap="xs">
            <Image height={36} src="/assets/icons/logo.png" width={36} />
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
          <Button component={Link} href="/upgrade" radius="xl" size="xs">
            Upgrade
          </Button>
          <AvatarDropdown />
        </Group>
      </Group>
    </AppShell.Header>
  )
}
