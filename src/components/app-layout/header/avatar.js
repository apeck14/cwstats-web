import { ActionIcon, Group, Menu } from "@mantine/core"
import { IconBrandDiscordFilled, IconLogout2, IconServer2, IconShield, IconUsers } from "@tabler/icons-react"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

import colors from "@/static/colors"

import AvatarWithFallback from "./avatar-with-fallback"
import classes from "./header.module.css"

export default function AvatarDropdown() {
  const { data: session } = useSession()

  return session ? (
    <Menu
      arrowPosition="center"
      closeDelay={350}
      openDelay={100}
      position="bottom"
      trigger="hover"
      width={200}
      withArrow
    >
      <Menu.Target>
        <Group>
          <AvatarWithFallback session={session} />
        </Group>
      </Menu.Target>

      <Menu.Dropdown fw={500}>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          component={Link}
          href="/me/servers"
          leftSection={<IconServer2 color="var(--mantine-color-pink-6)" size="1.25rem" />}
        >
          Servers
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/me/clans"
          leftSection={<IconShield color="var(--mantine-color-pink-6)" size="1.25rem" />}
        >
          Clans
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/me/players"
          leftSection={<IconUsers color="var(--mantine-color-pink-6)" size="1.25rem" />}
        >
          Players
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          color="var(--mantine-color-pink-6)"
          leftSection={<IconLogout2 size="1.25rem" />}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <ActionIcon
      aria-label="Sign In with Discord"
      className={classes.discord}
      color={colors.discord}
      onClick={() => signIn("discord")}
      radius="lg"
      size="lg"
      variant="filled"
    >
      <IconBrandDiscordFilled size="1.25rem" stroke={1.5} />
    </ActionIcon>
  )
}
