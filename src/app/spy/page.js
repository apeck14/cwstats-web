import { Container, Flex, Group, rem, Stack, TextInput, Title } from "@mantine/core"
import { IconSearch, IconSpy } from "@tabler/icons-react"

import SearchByClanModal from "../../components/spy/search-clan-modal"

export default function SpyPage() {
  return (
    <Flex className="circuit" h={`calc(100vh - ${rem(60)}`} w="100%">
      <Container h="50vh" m="auto" size="lg" w="100%">
        <Stack>
          <Group>
            <IconSpy color="var(--mantine-color-pink-6)" size="3.75rem" />
            <Title fz="3.75rem">Deck Spy</Title>
          </Group>
          <Group justify="space-between">
            <Title c="gray.2" fw={600} size="h3">
              View your opponent&apos;s decks in real-time!
            </Title>
            <SearchByClanModal />
          </Group>

          <TextInput
            leftSection={<IconSearch stroke={2} style={{ height: rem(24), width: rem(24) }} />}
            placeholder="Search players..."
            radius="md"
            size="lg"
            w="100%"
          />
        </Stack>
      </Container>
    </Flex>
  )
}
