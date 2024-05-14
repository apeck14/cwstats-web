import { Container, Text, Title } from "@mantine/core"

import LoginButton from "@/components/ui/login-button"

export const metadata = {
  description: "Log in with Discord to access all of CWStats!",
  title: "Log in | CWStats",
}

export default function LoginPage({ searchParams }) {
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
