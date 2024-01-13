"use client"

import { Button, Container, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"

export default function Page404() {
  const isMobile = useMediaQuery("(max-width: 30em)")

  return (
    <Container mt="15%" size="sm" ta="center">
      <Title c="pink.6" fw={900} fz={isMobile ? "3.5rem" : "5rem"}>
        404
      </Title>
      <Title c="gray.1" fw={800} fz={isMobile ? "1.5rem" : "2rem"}>
        Resource not found.
      </Title>
      <Text c="gray.2" fw={600} fz={isMobile ? "1.2rem" : "1.5rem"} mt="sm">
        We looked everywhere, but what you&apos;re looking for was deleted, or doesn&apos;t exist.
      </Text>
      <Button component={Link} href="/" mt="md" variant="light">
        Go to Home page
      </Button>
    </Container>
  )
}
