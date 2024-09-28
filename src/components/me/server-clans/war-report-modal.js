"use client"

import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

import { createWebhook } from "@/actions/discord"
import { sendLogWebhook } from "@/actions/upgrade"
import Image from "@/components/ui/image"
import { formatTag } from "@/lib/functions/utils"

import ChannelDropdown from "../home/channel-dropdown"

export default function WarReportModal({ channels, clan, id, isPlus, setWebhookActive }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const [channelId, setChannelId] = useState(null)

  const handleOpen = () => {
    setError("")
    setChannelId(null)
    open()
  }

  const handleSubmit = async () => {
    setLoading(true)

    const { error } = await createWebhook(channelId, "CWStats Reports", clan.tag, isPlus)

    setLoading(false)

    if (error) setError(error)
    else {
      setWebhookActive(true)
      close()
      notifications.show({
        autoClose: 8000,
        color: "green",
        message: `War Report successfully created for ${clan.clanName} in #${channels.find((c) => c.id === channelId)?.name}.`,
        title: "War Report Created!",
      })

      sendLogWebhook(
        {
          clan: clan.clanName,
          guild: id,
          tag: formatTag(clan.tag, true),
          title: "War Report Created",
        },
        true,
      )
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Daily War Report</Title>}>
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
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button disabled={!isPlus} maw="fit-content" onClick={handleOpen} size="xs" variant="default">
        Create
      </Button>
    </>
  )
}
