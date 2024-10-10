import { ActionIcon, Card, Divider, Group, Stack, Text, Title } from "@mantine/core"
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { deleteWebhook } from "@/actions/discord"
import { deleteLinkedClan } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import Image from "@/components/ui/image"
import { formatTag } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import WarReportModal from "./war-report-modal"

export default function LinkedClanCard({ channels, clan, clans, id, isPlus, setClans }) {
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)
  const [webhookActive, setWebhookActive] = useState(!!clan.webhookUrl)

  const handleConfirm = async () => {
    setClans(clans.filter((c) => c.tag !== clan.tag))
    await deleteLinkedClan(clan.tag)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "Linked Clan Deleted",
      },
      true,
    )
  }

  const handleDelete = () => {
    deleteWebhook(clan.tag)
    setWebhookActive(false)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "War Report Deleted",
      },
      true,
    )
  }

  return (
    <Card bd="2px solid var(--mantine-color-gray-7)" bg="gray.8">
      <Group justify="space-between">
        <Group gap="xs">
          <Image alt="Clan Badge" height={28} src={`/assets/badges/${clan.clanBadge}.webp`} />
          <Text className="pinkText" component={Link} fw="600" fz="xl" href={`/clan/${clan.tag.substring(1)}`}>
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
        <Group gap="0.3rem">
          <Title size="h5">Plus Features</Title>
          <Link href="/upgrade">
            <Image alt="CWStats Plus" height={12} src="/assets/icons/plus.webp" />
          </Link>
        </Group>

        <Card bd="2px solid gray.7" bg="gray.8" component={Stack} gap="xs" maw="20rem">
          <Text c="dimmed" fw="600">
            Daily War Report
          </Text>
          {webhookActive ? (
            <Stack gap="0.1rem">
              <Text fw="600" fz="sm">
                Status: <span style={{ color: "var(--mantine-color-green-6)" }}>ACTIVE</span>
              </Text>
              <Text c="dimmed" fs="italic" fz="xs">
                This webhook can be managed on Discord in your server&apos;s app integrations.
              </Text>

              <Text c="red.6" className="cursorPointer" fz="sm" onClick={handleDelete} td="underline" w="fit-content">
                Delete
              </Text>
            </Stack>
          ) : (
            <WarReportModal
              channels={channels}
              clan={clan}
              id={id}
              isPlus={isPlus}
              setWebhookActive={setWebhookActive}
            />
          )}
        </Card>
      </Stack>
    </Card>
  )
}
