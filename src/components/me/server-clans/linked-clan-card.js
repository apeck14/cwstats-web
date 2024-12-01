import { ActionIcon, Button, Card, Divider, Group, Stack, Text, Title } from "@mantine/core"
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { setDailyWarReport, setSeasonalReport } from "@/actions/discord"
import { deleteLinkedClan } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import Image from "@/components/ui/image"
import { formatTag } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import ReportModal from "./report-modal"

export default function LinkedClanCard({ channels, clan, clans, id, isPlus, setClans }) {
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)
  const [warReportEnabled, setWarReportEnabled] = useState(!!clan.warReportEnabled)
  const [seasonalReportEnabled, setSeasonalReportEnabled] = useState(!!clan.seasonalReportEnabled)

  const handleConfirm = async () => {
    setClans(clans.filter((c) => c.tag !== clan.tag))
    await deleteLinkedClan(id, clan.tag)

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

  const handleSeasonReportDisable = () => {
    setSeasonalReport(clan.tag, false)
    setSeasonalReportEnabled(false)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "Seasonal Report Disabled",
      },
      true,
    )
  }

  const handleWarReportDisable = () => {
    setDailyWarReport(clan.tag, false)
    setWarReportEnabled(false)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "War Report Disabled",
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
            <Image alt="CWStats Plus" height={12} src={`/assets/icons/${!isPlus ? "not-" : ""}plus.webp`} />
          </Link>
        </Group>

        <Group>
          <Card bd="2px solid gray.7" bg="gray.8" component={Stack} gap="xs" w="20rem">
            <Group gap="0.2rem">
              <Text c="dimmed" fw="600">
                Seasonal Report
              </Text>
              <Text c="pink" fw="600" fz="0.6rem">
                NEW
              </Text>
            </Group>

            {seasonalReportEnabled ? (
              <Button
                color="red"
                disabled={!isPlus || !clan.webhookUrl}
                maw="fit-content"
                onClick={handleSeasonReportDisable}
                size="xs"
                variant="light"
              >
                Disable
              </Button>
            ) : (
              <ReportModal
                channels={channels}
                clan={clan}
                id={id}
                isPlus={isPlus}
                setReportActive={setSeasonalReportEnabled}
                type="seasonal"
              />
            )}
          </Card>

          <Card bd="2px solid gray.7" bg="gray.8" component={Stack} gap="xs" w="20rem">
            <Text c="dimmed" fw="600">
              Daily War Report
            </Text>

            {warReportEnabled ? (
              <Button
                color="red"
                disabled={!isPlus || !clan.webhookUrl}
                maw="fit-content"
                onClick={handleWarReportDisable}
                size="xs"
                variant="light"
              >
                Disable
              </Button>
            ) : (
              <ReportModal
                channels={channels}
                clan={clan}
                id={id}
                isPlus={isPlus}
                setReportActive={setWarReportEnabled}
                type="war"
              />
            )}
          </Card>
        </Group>
      </Stack>
    </Card>
  )
}
