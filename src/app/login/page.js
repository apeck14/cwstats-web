"use client"

import { Button, Container, Text, Title } from "@mantine/core"
import { IconBrandDiscord } from "@tabler/icons-react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const params = useSearchParams()
  const callback = params.get("callback")

  console.log(callback)

  return (
    <Container pt="10rem" size="lg" ta="center">
      <Title>Oops! Looks like you&apos;re not logged in...</Title>
      <Text c="gray.1" fw={600} mt="xs">
        To access the full site please log in with Discord
      </Text>
      <Button
        leftSection={<IconBrandDiscord />}
        mt="sm"
        onClick={() =>
          signIn("discord", {
            callbackUrl: callback,
          })
        }
        variant="light"
      >
        Log in
      </Button>
    </Container>
  )
}
