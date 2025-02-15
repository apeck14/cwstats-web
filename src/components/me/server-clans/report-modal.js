"use client"

import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

import { createWebhook, setDailyWarReport, setSeasonalReport } from "@/actions/discord"
import { getLinkedClanByTag } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import Image from "@/components/ui/image"
import { formatTag } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import ChannelDropdown from "../home/channel-dropdown"

export default function ReportModal({ channels, clan, id, isPlus, setHasWebhook, setReportActive, type }) {
  const [error, setError] = useState("")
  const [enabledLoading, setEnableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const [channelId, setChannelId] = useState(null)

  const formattedType = `${type[0].toUpperCase()}${type.slice(1)}`

  const sendEnableNotifications = () => {
    notifications.show({
      autoClose: 8000,
      color: "green",
      message: `${formattedType} Report successfully enabled for ${clan.clanName}.`,
      title: `${formattedType} Report Enabled!`,
    })

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.orange,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: `${formattedType} Report Enabled`,
      },
      true,
    )
  }

  const handleOpen = async () => {
    setError("")
    setChannelId(null)

    setEnableLoading(true)

    const { clan: linkedClan } = await getLinkedClanByTag(clan.tag)
    const webhookExists = !!linkedClan?.webhookUrl

    setEnableLoading(false)

    if (webhookExists) {
      if (type === "war") setDailyWarReport(clan.tag)
      else if (type === "seasonal") setSeasonalReport(clan.tag)
      setReportActive(true)
      sendEnableNotifications()
    } else {
      open()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    const { error } = await createWebhook(channelId, "CWStats Reports", clan.tag, isPlus)

    setLoading(false)

    if (error) setError(error)
    else {
      if (type === "war") setDailyWarReport(clan.tag)
      else if (type === "seasonal") setSeasonalReport(clan.tag)

      if (type === "webhook-only") setHasWebhook(true)
      else setReportActive(true)

      close()
      sendEnableNotifications()
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Enable {formattedType} Report</Title>}>
        <Stack gap="md">
          <Divider color="gray.6" size="sm" />

          <Group gap="0.25rem">
            <Image alt="Clan Badge" height={24} src={`/assets/badges/${clan.clanBadge}.webp`} />
            <Text fw="600" fz="md">
              {clan.clanName}
            </Text>
          </Group>

          <Text c="dimmed" fw="600" size="sm">
            IMPORTANT: Enable the Manage Webhooks permission for the bot!
          </Text>

          <ChannelDropdown channels={channels} error={error} setChannel={setChannelId} />

          <Group justify="flex-end">
            <Button disabled={!channelId} loading={loading} onClick={handleSubmit}>
              Enable
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button
        disabled={type !== "webhook-only" && !isPlus}
        loading={enabledLoading}
        maw="fit-content"
        onClick={handleOpen}
        size="xs"
        variant="default"
      >
        {type === "webhook-only" ? "Create Webhook" : "Enable"}
      </Button>
    </>
  )
}
