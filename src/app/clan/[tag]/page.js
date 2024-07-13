import { Avatar, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core"
import { redirect } from "next/navigation"

import { getClan } from "@/actions/supercell"
import ClanHeader from "@/components/clan/header"
import MembersTable from "@/components/clan/members-table"
import Image from "@/components/ui/image"
import {
  formatClanType,
  getClanBadgeFileName,
  getCountryKeyById,
  getSupercellRedirectRoute,
} from "@/lib/functions/utils"

export async function generateMetadata({ params }) {
  const { tag } = params
  const { data: clan } = await getClan(tag)

  if (!clan) return

  return {
    description: clan.description,
    openGraph: {
      images: `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`,
    },
    title: `${clan.name} ${clan.tag} | Home - CWStats`,
  }
}

export default async function ClanPage({ params }) {
  const { tag } = params
  const { data: clan, status } = await getClan(tag)

  if (status !== 200) redirect(getSupercellRedirectRoute(status))
  else {
    const locationKey = getCountryKeyById(clan?.location?.id)

    return (
      <>
        <ClanHeader clan={clan} />
        <Container size="lg">
          <Stack py="md">
            <Text>{clan?.description}</Text>
            <SimpleGrid cols={{ base: 2, md: 3 }}>
              <Group>
                <Image alt="Trophies" height={32} src="/assets/icons/trophy-ribbon.webp" />
                <Stack gap={0}>
                  <Text c="gray.1" fw={600}>
                    Trophies
                  </Text>
                  <Text>{clan?.clanScore}</Text>
                </Stack>
              </Group>
              <Group>
                <Image alt="Trophy" height={32} src="/assets/icons/trophy.webp" />
                <Stack gap={0}>
                  <Text c="gray.1" fw={600}>
                    Req. Trophies
                  </Text>
                  <Text>{clan?.requiredTrophies}</Text>
                </Stack>
              </Group>
              <Group>
                <Image alt="Donations" height={32} src="/assets/icons/cards.webp" />
                <Stack gap={0}>
                  <Text c="gray.1" fw={600}>
                    Donations
                  </Text>
                  <Text>{clan?.donationsPerWeek}</Text>
                </Stack>
              </Group>
              <Group>
                <Image alt="Members" height={32} src="/assets/icons/social.webp" />
                <Stack gap={0}>
                  <Text c="gray.1" fw={600}>
                    Members
                  </Text>
                  <Text>{clan?.members} / 50</Text>
                </Stack>
              </Group>
              <Group>
                <Image alt="Players" height={32} src="/assets/icons/players.webp" />
                <Stack gap={0}>
                  <Text c="gray.1" fw={600}>
                    Type
                  </Text>
                  <Text>{formatClanType(clan?.type)}</Text>
                </Stack>
              </Group>
              <Group>
                <Avatar size={32} src={`/assets/flag-icons/${locationKey}.webp`} />
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
}
