import { Group, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

import { getCardFileName } from "../../lib/functions/utils"
import Image from "../ui/image"
import InfoPopover from "../ui/info-popover"

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
                  No duel found
                </Text>
                <InfoPopover text="Player battle logs only contain last 25 matches." width={175} />
              </Group>
            ) : (
              decks.duel.map((d) => (
                <Group gap={deckGap} key={d.cards[0]}>
                  <Image alt={d.img} height={modeIconPx} src={`/assets/gamemodes/${d.img}.webp`} width={modeIconPx} />
                  {d.cards.map((c) => (
                    <Image
                      alt={c}
                      height={cardIconPx}
                      key={c}
                      src={`/assets/cards/${getCardFileName(c)}.webp`}
                      width={cardIconPx}
                    />
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
                <InfoPopover text="Player battle logs only contain last 25 matches." width={175} />
              </Group>
            ) : (
              decks.other.map((d) => (
                <Group gap={deckGap} key={d.cards[0]}>
                  <Image alt={d.img} height={modeIconPx} src={`/assets/gamemodes/${d.img}.webp`} width={modeIconPx} />
                  {d.cards.map((c) => (
                    <Image
                      alt={c}
                      height={cardIconPx}
                      key={c}
                      src={`/assets/cards/${getCardFileName(c)}.webp`}
                      width={cardIconPx}
                    />
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
