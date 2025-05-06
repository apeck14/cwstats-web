import { Card, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconArrowNarrowRight, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import Link from "next/link"

import { getWeeklyStats } from "../../../actions/api"
import { getClanBadgeFileName } from "../../../lib/functions/utils"
import Image from "../../ui/image"
import classes from "../Home.module.css"

export default async function RisersAndFallers() {
  const stats = await getWeeklyStats()

  return (
    <Stack bg="gray.10" mt="-1rem">
      <Container py="3rem" size="lg" w="100%">
        <SimpleGrid cols={{ base: 1, md: 2 }} mt="md" spacing="xl">
          <Card bg="transparent" p={0}>
            <Title>
              Weekly <span style={{ color: "var(--mantine-color-green-6)" }}>Risers</span>
            </Title>
            <Stack gap="xs" mt="lg">
              {stats?.risers?.map((r) => (
                <Card
                  bg="gray.9"
                  className={classes.risersFallersCard}
                  component={Link}
                  href={`/clan/${r.tag.substring(1)}/log`}
                  key={r.tag}
                  p="sm"
                  prefetch={false}
                >
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Image
                        alt="Clan Badge"
                        height={30}
                        src={`/assets/badges/${getClanBadgeFileName(r.badgeId, r.clanScore)}.webp`}
                      />
                      <Text fw={600}>{r.name}</Text>
                    </Group>
                    <Stack align="end" gap="0">
                      <Group gap="0.25rem">
                        <IconTrendingUp color="var(--mantine-color-green-6)" />
                        <Text fw={600}>{r.previousRank - r.rank}</Text>
                      </Group>
                      <Group gap="0.1rem">
                        <Text c="gray.1" fw={600} fz="xs">
                          #{r.previousRank}
                        </Text>
                        <IconArrowNarrowRight color="var(--mantine-color-gray-2)" size="1rem" />
                        <Text c="gray.1" fw={600} fz="xs">
                          #{r.rank}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
          <Card bg="transparent" p={0}>
            <Title>
              Weekly <span style={{ color: "var(--mantine-color-red-6)" }}>Fallers</span>
            </Title>
            <Stack gap="xs" mt="lg">
              {stats?.fallers?.map((f) => (
                <Card
                  bg="gray.9"
                  className={classes.risersFallersCard}
                  component={Link}
                  href={`/clan/${f.tag.substring(1)}/log`}
                  key={f.tag}
                  p="sm"
                  prefetch={false}
                >
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Image
                        alt="Clan Badge"
                        height={30}
                        src={`/assets/badges/${getClanBadgeFileName(f.badgeId, f.clanScore)}.webp`}
                      />
                      <Text fw={600}>{f.name}</Text>
                    </Group>
                    <Stack align="end" gap="0">
                      <Group gap="0.25rem">
                        <IconTrendingDown color="var(--mantine-color-red-6)" />
                        <Text fw={600}>{f.rank - f.previousRank}</Text>
                      </Group>
                      <Group gap="0.1rem">
                        <Text c="gray.1" fw={600} fz="xs">
                          #{f.previousRank}
                        </Text>
                        <IconArrowNarrowRight color="var(--mantine-color-gray-2)" size="1rem" />
                        <Text c="gray.1" fw={600} fz="xs">
                          #{f.rank}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>
    </Stack>
  )
}
