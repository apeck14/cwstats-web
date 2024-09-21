import { ActionIcon, Card, Divider, Group, Select, Stack, Text } from "@mantine/core"
import { IconCheck, IconHash, IconTrash, IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { deleteLinkedClan } from "@/actions/server"
import Image from "@/components/ui/image"

export default function LinkedClanCard({ clan, clans, isPlus, setClans }) {
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)

  const handleConfirm = async () => {
    setClans(clans.filter((c) => c.tag !== clan.tag))
    await deleteLinkedClan(clan.tag)
  }

  return (
    <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8">
      <Group justify="space-between">
        <Group gap="xs">
          <Image alt="Clan Badge" height={28} src={`/assets/badges/${clan.clanBadge}.webp`} />
          <Text className="pinkText" component={Link} fw="600" fz="lg" href={`/clan/${clan.tag.substring(1)}`}>
            {clan.clanName}
          </Text>
          {isPlus ? (
            <Link href={`/clan/${clan.tag.substring(1)}/plus/daily-tracking`}>
              <Image alt="CWStats Plus" height={16} src="/assets/icons/plus.webp" />
            </Link>
          ) : (
            <Link href="/upgrade">
              <Image alt="CWStats Plus" height={16} src="/assets/icons/not-plus.webp" />
            </Link>
          )}
        </Group>
        {showConfirmButtons ? (
          <Group gap="xs">
            <ActionIcon color="green" onClick={handleConfirm}>
              <IconCheck size="1.25rem" />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => setShowConfirmButtons(false)}>
              <IconX size="1.25rem" />
            </ActionIcon>
          </Group>
        ) : (
          <ActionIcon color="red" onClick={() => setShowConfirmButtons(true)}>
            <IconTrash size="1.25rem" />
          </ActionIcon>
        )}
      </Group>

      <Divider color="gray.7" my="md" size="md" />

      <Stack gap="xs">
        <Text c="dimmed" fw="500" fz="sm">
          War Report Channel
        </Text>
        <Select leftSection={<IconHash />} maw="10rem" placeholder="Coming soon!" />
      </Stack>
    </Card>
  )
}
