import { ActionIcon, Avatar, Menu, rem } from "@mantine/core"
import { IconBrandDiscordFilled, IconLogout2, IconServer2, IconShield, IconUsers } from "@tabler/icons-react"
import { signIn, signOut, useSession } from "next-auth/react"

import classes from "./header.module.css"

export default function AvatarDropdown() {
  const { data: session } = useSession()

  return session ? (
    <Menu
      arrowPosition="center"
      closeDelay={350}
      openDelay={100}
      position="bottom-end"
      trigger="hover"
      width={200}
      withArrow
    >
      <Menu.Target>
        <Avatar className={classes.avatar} size="md" src={session?.user?.image} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          leftSection={<IconServer2 color="var(--mantine-color-pink-6)" style={{ height: rem(14), width: rem(14) }} />}
        >
          Servers
        </Menu.Item>
        <Menu.Item
          leftSection={<IconShield color="var(--mantine-color-pink-6)" style={{ height: rem(14), width: rem(14) }} />}
        >
          Clans
        </Menu.Item>
        <Menu.Item
          leftSection={<IconUsers color="var(--mantine-color-pink-6)" style={{ height: rem(14), width: rem(14) }} />}
        >
          Players
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          color="var(--mantine-color-pink-6)"
          leftSection={<IconLogout2 style={{ height: rem(14), width: rem(14) }} />}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <ActionIcon
      aria-label="Sign In with Discord"
      color="#7289da"
      onClick={() => signIn("discord")}
      radius="lg"
      variant="filled"
    >
      <IconBrandDiscordFilled stroke={1.5} style={{ height: "65%" }} />
    </ActionIcon>
  )
}
