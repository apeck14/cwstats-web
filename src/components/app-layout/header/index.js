import { AppShell, Button, Group, Text } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/navigation"

import Image from "../../ui/image"
import AvatarDropdown from "./avatar"
import NavLinks from "./nav-links"

export default function Header() {
  const router = useRouter()
  return (
    <AppShell.Header bg="gray.10" h={60} px="sm">
      <Group align="center" h="100%" justify="space-between">
        <Group gap="xl" h="100%">
          <Group gap="xs">
            <Image height={36} src="/assets/icons/logo.png" width={36} />
            <Link href="/">
              <Text fw={800} size="1.5rem">
                CWStats
              </Text>
            </Link>
          </Group>
          <Group h="100%" visibleFrom="md">
            <NavLinks />
          </Group>
        </Group>

        <Group>
          <Button onClick={() => router.push("/upgrade")} size="xs">
            Upgrade
          </Button>
          <AvatarDropdown />
        </Group>
      </Group>
    </AppShell.Header>
  )
}
