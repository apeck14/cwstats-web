"use client"

import { Button, Container, Text, Title } from "@mantine/core"
import Link from "next/link"

export default function ErrorPage({ code, description, title }) {
  return (
    <Container mt="15%" size="sm" ta="center">
      <Title c="pink.6" fw={900} fz={{ base: "3.5rem", md: "5rem" }}>
        {code}
      </Title>
      <Title c="gray.1" fw={800} fz={{ base: "1.5rem", md: "2rem" }}>
        {title}
      </Title>
      <Text c="gray.2" fw={600} fz={{ base: "1.2rem", md: "1.5rem" }} mt="sm">
        {description}
      </Text>
      <Button component={Link} href="/" mt="md" variant="light">
        Go to Home page
      </Button>
    </Container>
  )
}
