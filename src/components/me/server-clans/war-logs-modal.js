"use client"

import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

import { sendLogWebhook } from "@/actions/upgrade"
import { formatTag } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import { setWarLogClan, setWarLogClanActive } from "../../../actions/server"
import ChannelDropdown from "../home/channel-dropdown"

export default function WarLogsModal({ channels, clan, enabled, id }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const [channelId, setChannelId] = useState(null)
  const [showEnabled, setShowEnabled] = useState(!clan?.warLogsEnabled || !clan?.webhookUrl1 || !clan?.webhookUrl2)

  const sendEnableNotifications = () => {
    notifications.show({
      autoClose: 8000,
      color: "green",
      message: `War Logs successfully enabled for ${clan.clanName}.`,
      title: `War Logs Enabled!`,
    })

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.orange,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: `War Logs Enabled`,
      },
      true,
    )
  }

  const handleOpen = async () => {
    setError("")
    setChannelId(null)

    open()
  }

  const handleSubmit = async () => {
    setLoading(true)

    const { error } = await setWarLogClan({ channelId, guildId: id, tag: clan.tag })

    setLoading(false)

    if (error) {
      setError(error)
    } else {
      close()
      setShowEnabled(false)
      sendEnableNotifications()
    }
  }

  const handleDisable = async () => {
    const { success } = await setWarLogClanActive(clan.tag, false)
    if (success) setShowEnabled(true)
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Enable War Logs</Title>}>
        <Stack gap="md">
          <Divider color="gray.6" size="sm" />

          <Text c="dimmed" fw="600" size="sm">
            <span style={{ color: "var(--mantine-color-orange-6)" }}>IMPORTANT</span>: Enable the Manage Webhooks
            permission for the bot!
          </Text>

          <ChannelDropdown channels={channels} setChannel={setChannelId} />

          <Group justify={error ? "space-between" : "flex-end"}>
            {error && (
              <Text c="red.6" fw="600" size="sm">
                {error}
              </Text>
            )}
            <Button disabled={!channelId} loading={loading} onClick={handleSubmit}>
              Enable
            </Button>
          </Group>
        </Stack>
      </Modal>

      {showEnabled ? (
        <Button disabled={!enabled} onClick={handleOpen} size="xs" variant="default" w="fit-content">
          Enable
        </Button>
      ) : (
        <Button color="red" disabled={!enabled} onClick={handleDisable} size="xs" variant="light">
          Disable
        </Button>
      )}
    </>
  )
}
