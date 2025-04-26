import { Card, Group, Stack } from "@mantine/core"
import { IconBrandDiscordFilled } from "@tabler/icons-react"
import { signIn } from "next-auth/react"

import colors from "@/static/colors"

import classes from "../Home.module.css"

export default function LoginOverlay() {
  return (
    <Card bg="transparent" className={classes.card} h="25rem" p={0} withBorder>
      <Stack className={classes.overlay} fw={700} h="100%" onClick={() => signIn("discord")}>
        <Group>Log in with</Group>
        <Group c={colors.discord}>
          <IconBrandDiscordFilled size={35} />
        </Group>
      </Stack>
    </Card>
  )
}
