import { Group, Loader, Popover, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconInfoCircle } from "@tabler/icons-react"

import useWindowSize from "../../hooks/useWindowSize"
import { breakpointObj, getCardFileName } from "../../lib/functions"
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
  const { breakpoint } = useWindowSize()

  const modeIconPx = breakpointObj(24, 24, 24, 32)[breakpoint]
  const cardIconPx = breakpointObj(38, 38, 38, 44)[breakpoint]
  const deckGap = breakpointObj("0.25rem", "0.25rem", "0.25rem", "0.25rem", "0.5rem")[breakpoint]

  return (
    <Stack
      align={decks ? "flex-start" : "center"}
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
