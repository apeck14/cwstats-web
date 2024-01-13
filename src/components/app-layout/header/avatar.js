import { ActionIcon, Avatar, Menu } from "@mantine/core"
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

      <Menu.Dropdown bg="gray.8" style={{ borderColor: "var(--mantine-color-gray-6" }}>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconServer2 color="var(--mantine-color-pink-6)" size="1.25rem" />}>Servers</Menu.Item>
        <Menu.Item leftSection={<IconShield color="var(--mantine-color-pink-6)" size="1.25rem" />}>Clans</Menu.Item>
        <Menu.Item leftSection={<IconUsers color="var(--mantine-color-pink-6)" size="1.25rem" />}>Players</Menu.Item>

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
      color="#7289da"
      onClick={() => signIn("discord")}
      radius="lg"
      size="lg"
      variant="filled"
    >
      <IconBrandDiscordFilled stroke={1.5} style={{ height: "1.25rem" }} />
    </ActionIcon>
  )
}
