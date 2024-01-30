import { Group, Stack, Text, Title } from "@mantine/core"

import Image from "./image"

export default function ComingSoon({ size, subText }) {
  return (
    <Group justify="center" my="10dvh" wrap="nowrap">
      <Image alt="Confetti" height={size || 50} src="/assets/icons/confetti.png" />
      <Stack gap={0}>
        <Title c="gray.1" fz={{ base: "1.25rem", md: "2rem" }}>
          Coming Soon!
        </Title>
        <Text c="dimmed" fw={600} fz={{ base: "0.9em", md: "1rem" }}>
          {subText || "Join the Support Server to stay up to date on new updates!"}
        </Text>
      </Stack>
    </Group>
  )
}
