import { Avatar, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core"
import { headers as getHeaders } from "next/headers"

import { getClan } from "../../../actions/supercell"
import ClanHeader from "../../../components/clan/header"
import MembersTable from "../../../components/clan/members-table"
import Image from "../../../components/ui/image"
import { formatClanType, getCountryKeyById, getTagFromHeaders } from "../../../lib/functions"

export default async function ClanPage() {
  const headers = getHeaders()
  const tag = getTagFromHeaders(headers)
  const { data: clan } = await getClan(tag, true)

  const locationKey = getCountryKeyById(clan?.location?.id)

  return (
    <>
      <ClanHeader clan={clan} />
      <Container size="lg">
        <Stack py="md">
          <Text>{clan?.description}</Text>
          <SimpleGrid cols={{ base: 2, md: 3 }}>
            <Group>
              <Image height={32} src="/assets/icons/trophy-ribbon.png" />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Trophies
                </Text>
                <Text>{clan?.clanScore}</Text>
              </Stack>
            </Group>
            <Group>
              <Image height={32} src="/assets/icons/trophy.png" />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Req. Trophies
                </Text>
                <Text>{clan?.requiredTrophies}</Text>
              </Stack>
            </Group>
            <Group>
              <Image height={32} src="/assets/icons/cards.png" />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Donations
                </Text>
                <Text>{clan?.donationsPerWeek}</Text>
              </Stack>
            </Group>
            <Group>
              <Image height={32} src="/assets/icons/social.png" />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Members
                </Text>
                <Text>{clan?.members} / 50</Text>
              </Stack>
            </Group>
            <Group>
              <Image height={32} src="/assets/icons/players.png" />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Type
                </Text>
                <Text>{formatClanType(clan?.type)}</Text>
              </Stack>
            </Group>
            <Group>
              <Avatar size={32} src={`/assets/flags/${locationKey}.png`} />
              <Stack gap={0}>
                <Text c="gray.1" fw={600}>
                  Region
                </Text>
                <Text>{clan?.location?.name}</Text>
              </Stack>
            </Group>
          </SimpleGrid>
          <MembersTable members={clan?.memberList} />
        </Stack>
      </Container>
    </>
  )
}
