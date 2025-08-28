import { Stack, Text, Title } from "@mantine/core"
import { IconWorldShare } from "@tabler/icons-react"

export default function Redirecting() {
  return (
    <Stack align="center" mt="10%" ta="center">
      <IconWorldShare color="var(--mantine-color-gray-6)" size="6rem" />
      <Title fz={{ base: "1.75rem", md: "2.5rem" }}>Redirecting you...</Title>
      <Text c="gray.1" fz={{ base: "1rem", md: "1.25rem" }}>
        Please give us a moment while we send you to the correct location.
      </Text>
    </Stack>
  )
}

// IconWorldShare
