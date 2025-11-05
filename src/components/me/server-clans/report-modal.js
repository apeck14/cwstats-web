"use client"

import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"

import Image from "@/components/ui/image"

import ChannelDropdown from "../home/channel-dropdown"

/**
 * Report modal for setting up war/seasonal reports
 * - Only acccessible when no webhookUrl is set
 */

export default function ReportModal({ channels, clan, handleReportUpdate, isPlus, type }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const [channelId, setChannelId] = useState(null)

  const formattedType = `${type[0].toUpperCase()}${type.slice(1)} Report`

  const handleOpen = async () => {
    setError("")
    setChannelId(null)
    open()
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await handleReportUpdate(true)
    setLoading(false)

    if (error) setError(error)
    else {
      close()
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Enable {formattedType}</Title>}>
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
      <Button disabled={!isPlus} maw="fit-content" onClick={handleOpen} size="xs" variant="default">
        Enable
      </Button>
    </>
  )
}
