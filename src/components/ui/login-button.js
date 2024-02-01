"use client"

import { Button } from "@mantine/core"
import { IconBrandDiscord } from "@tabler/icons-react"
import { signIn } from "next-auth/react"

export default function LoginButton({ callbackUrl }) {
  return (
    <Button
      leftSection={<IconBrandDiscord />}
      mt="sm"
      onClick={() =>
        signIn("discord", {
          callbackUrl,
          redirect: false,
        })
      }
      variant="light"
    >
      Log in
    </Button>
  )
}
