"use client"

import { Container, Text, Title } from "@mantine/core"
import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

import LoginButton from "../ui/login-button"

export default function LoginContent({ searchParams }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      signOut()
    }
  }, [])

  return (
    <Container pt="10rem" size="lg" ta="center">
      <Title>Oops! Looks like you&apos;re not logged in...</Title>
      <Text c="gray.1" fw={600} mt="xs">
        To access the full site please log in with Discord
      </Text>
      <LoginButton callbackUrl={searchParams.callback} />
    </Container>
  )
}
