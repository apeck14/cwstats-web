import { Group, Loader, Popover, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconInfoCircle } from "@tabler/icons-react"

import { getCardFileName } from "../../lib/functions/utils"
import Image from "../ui/image"

function InfoPopover() {
  const [opened, { close, open }] = useDisclosure(false)

  return (
    <Popover opened={opened} position="bottom" shadow="md" width={175} withArrow>
      <Popover.Target>
        <IconInfoCircle color="var(--mantine-color-pink-6)" onMouseEnter={open} onMouseLeave={close} size="1rem" />
      </Popover.Target>
      <Popover.Dropdown p="xs" style={{ fontSize: "0.75rem", pointerEvents: "none" }}>
        Player battle logs only contain last 25 matches.
      </Popover.Dropdown>
    </Popover>
  )
}

export default function DeckContent({ decks, loading }) {
  const isTablet = useMediaQuery("(max-width: 48em)")

  const modeIconPx = isTablet ? 24 : 32
  const cardIconPx = isTablet ? 38 : 44
  const deckGap = `${isTablet ? 0.25 : 0.5}rem`

  return (
    <Stack
      align={loading ? "center" : "flex-start"}
      bg="gray.8"
      mt="sm"
      p="md"
      radius="md"
      style={{ borderRadius: "0.5rem" }}
    >
      {decks && !loading ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} w="100%">
          <Stack>
            <Title fz="1.5rem">Most Recent Duel</Title>
            {!decks.duel.length ? (
              <Group c="gray.2" gap="0.25rem">
                <Text c="gray.2" fw={500}>
                  No decks found
                </Text>
                <InfoPopover />
              </Group>
            ) : (
              decks.duel.map((d) => (
                <Group gap={deckGap}>
                  <Image height={modeIconPx} src={`/assets/gamemodes/${d.img}.png`} width={modeIconPx} />
                  {d.cards.map((c) => (
                    <Image height={cardIconPx} src={`/assets/cards/${getCardFileName(c)}.png`} width={cardIconPx} />
                  ))}
                </Group>
              ))
            )}
          </Stack>
          <Stack>
            <Title fz="1.5rem">Other Deck(s)</Title>
            {!decks.other.length ? (
              <Group c="gray.2" gap="0.25rem">
                <Text c="gray.2" fw={500}>
                  No decks found
                </Text>
                <InfoPopover />
              </Group>
            ) : (
              decks.other.map((d) => (
                <Group gap={deckGap}>
                  <Image height={modeIconPx} src={`/assets/gamemodes/${d.img}.png`} width={modeIconPx} />
                  {d.cards.map((c) => (
                    <Image height={cardIconPx} src={`/assets/cards/${getCardFileName(c)}.png`} width={cardIconPx} />
                  ))}
                </Group>
              ))
            )}
          </Stack>
        </SimpleGrid>
      ) : (
        <Loader />
      )}
    </Stack>
  )
}
