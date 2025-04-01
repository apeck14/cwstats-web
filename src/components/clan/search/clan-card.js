import { Card, Divider, Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

import Image from "@/components/ui/image"
import { formatClanType, getClanBadgeFileName, getCountryKeyById } from "@/lib/functions/utils"

export default function ClanSearchCard({ clan }) {
  return (
    <Card bg="gray.10" style={{ border: `1px solid var(--mantine-color-gray-7)` }}>
      <Group align="flex-start" justify="space-between">
        <Stack gap="xs">
          <Text className="pinkText" component={Link} fw="600" href={`/clan/${clan.tag.substring(1)}`} prefetch={false}>
            {clan.name}
          </Text>
          <Text c="dimmed" fw="500" size="sm">
            {clan.tag} • {formatClanType(clan.type)}
          </Text>
        </Stack>

        <Image
          alt="Badge"
          height={48}
          src={`/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.webp`}
        />
      </Group>
      <Divider color="gray.7" my="md" size="xs" />

      <Stack gap="0.2rem">
        <Group gap="xs">
          <Image alt="Trophy" height={16} src="/assets/icons/cw-trophy.webp" />
          <Text c="gray.1" fw="600" fz="sm">
            {clan.clanWarTrophies}
          </Text>
        </Group>
        <Group gap="xs">
          <Image alt="Trophy" height={16} src="/assets/icons/trophy.webp" />
          <Text c="gray.1" fz="sm">
            {clan.clanScore} (Req. {clan.requiredTrophies})
          </Text>
        </Group>
        <Group gap="xs">
          <Image alt="Trophy" height={16} src="/assets/icons/social.webp" />
          <Text c="gray.1" fz="sm">
            {clan.members} / 50
          </Text>
        </Group>
        <Group gap="xs">
          <Image alt="Trophy" height={16} src={`/assets/flag-icons/${getCountryKeyById(clan.location.id)}.webp`} />
          <Text c="gray.1" fz="sm">
            {clan.location.name}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}
