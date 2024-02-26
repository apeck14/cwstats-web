"use client"

import { Button, Group, Modal, Select, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconHash } from "@tabler/icons-react"
import { useLogger } from "next-axiom"
import { useMemo, useState } from "react"

import { addScheduledNudge } from "@/actions/server"
import { getUTCOffset } from "@/lib/functions/date-time"
import { formatTag } from "@/lib/functions/utils"

import ChannelDropdown from "../home/channel-dropdown"

export default function AddNudgeModal({ channels, id, onAdd }) {
  const logger = useLogger()
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      amPm: "",
      channel: "",
      clanTag: "",
      hour: "",
    },
    validate: {
      amPm: (val) => (!val ? "You must select AM or PM." : null),
      channel: (val) => (!val ? "You must select a channel." : null),
      clanTag: (val) => (val.length < 5 ? "Invalid clan tag." : null),
      hour: (val) => (!val ? "You must select an hour." : null),
    },
  })

  const usersTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const handleOpen = () => {
    form.reset()
    open()
  }

  const handleTagChange = (e) => {
    const val = formatTag(e.currentTarget.value)

    // empty textbox
    if (!val) {
      form.setFieldValue("clanTag", "")
      return
    }

    if (val !== form.values.clanTag) {
      if (form.errors.clanTag) form.setFieldError("clanTag", "")
      form.setValues({ clanTag: val })
    }
  }

  const handleChannelSelect = (id) => {
    form.setValues({ channel: id })
  }

  const handleHourSelect = (hour) => {
    form.setValues({ hour })
  }

  const handleAMPMSelect = (amPm) => {
    form.setValues({ amPm })
  }

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return

    setLoading(true)

    const { amPm, channel, clanTag, hour: hourInput } = form.values

    // add timezone offset to hour inputted
    const offset = getUTCOffset(usersTimezone)
    const inverseOffset = offset * -1
    let hour = parseInt(hourInput)

    // convert hour to 24 time
    if (amPm === "PM") hour += 12
    if (hour === 24) hour = 0

    // convert hour to UTC
    let utcHour = hour + inverseOffset

    if (utcHour >= 24) utcHour -= 24
    else if (utcHour < 0) utcHour += 24

    const formattedTag = formatTag(clanTag, true)

    const { message, name, success, type } = await addScheduledNudge(id, formattedTag, utcHour, channel)

    setLoading(false)

    if (!success) {
      if (type === "clan") form.setErrors({ clanTag: message })
      else form.setErrors({ channel: message })
    } else {
      const channelName = channels.find((c) => c.id === channel).name || "deleted-channel"

      logger.info("Scheduled Nudge Added", { amPm, hour, utcHour })

      close()
      onAdd({
        channelID: channel,
        clanName: name,
        clanTag: formattedTag,
        scheduledHourUTC: utcHour,
      })
      notifications.show({
        autoClose: 8000,
        color: "green",
        message: `Nudge scheduled daily at ${hour} ${amPm} for ${name} in #${channelName}.`,
        title: "Nudge Successfully Added!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Add Scheduled Nudge</Title>}>
        <Stack gap="md">
          <TextInput
            label="Clan Tag"
            leftSection={<IconHash />}
            leftSectionPointerEvents="none"
            maxLength={9}
            placeholder="ABC123"
            size="md"
            variant="filled"
            withAsterisk
            {...form.getInputProps("clanTag")}
            data-autofocus
            onChange={handleTagChange}
          />

          <Group wrap="nowrap">
            <Select
              data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
              label="Hour"
              placeholder="Select hour"
              size="md"
              withAsterisk
              {...form.getInputProps("hour")}
              onChange={handleHourSelect}
            />
            <Select
              data={["AM", "PM"]}
              label="AM/PM"
              placeholder="Select AM/PM"
              size="md"
              withAsterisk
              {...form.getInputProps("amPm")}
              onChange={handleAMPMSelect}
            />
          </Group>

          <Text c="dimmed" fw={600} size="xs">
            Timezone: {usersTimezone}
          </Text>

          <ChannelDropdown channels={channels} {...form.getInputProps("channel")} setChannel={handleChannelSelect} />

          <Group justify="flex-end">
            <Button loading={loading} onClick={handleSubmit}>
              Add
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button fz="0.9rem" onClick={handleOpen} size="xs">
        Add
      </Button>
    </>
  )
}
