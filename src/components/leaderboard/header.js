import { Container, Group, Stack, Text } from "@mantine/core"

export default function LeaderboardHeader({ countryKey }) {
  return (
    <Group bg="green">
      <Container size="lg">
        <Group justify="space-between">
          <Group>
            <Text>Image</Text>
            <Text>Country</Text>
          </Group>
          <Stack>
            <Text>Last Updated</Text>
            <Text>Toggle</Text>
          </Stack>
        </Group>
      </Container>
    </Group>
  )
}
