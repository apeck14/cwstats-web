"use client"

import { ActionIcon, Button, Checkbox, Group, Modal, Select, Stack, Text, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconPencil } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { editScheduledNudge } from "@/actions/server"
import { getUTCOffset } from "@/lib/functions/date-time"

import ChannelDropdown from "../home/channel-dropdown"

export default function EditNudgeModal({ channels, id, nudge, onEdit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)

  const { channelID, clanName, ignoreLeaders, ignoreWhenCrossedFinishLine, scheduledHourUTC } = nudge || {}

  const usersTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const initialTimeData = useMemo(() => {
    const offset = getUTCOffset(usersTimezone)
    const adjustedHour = (scheduledHourUTC + offset + 24) % 24
    const amPm = adjustedHour < 12 ? "AM" : "PM"

    const hourTo12 = adjustedHour % 12
    const formattedHour = hourTo12 === 0 ? 12 : hourTo12

    return { amPm, hour: formattedHour.toString() }
  }, [])

  const form = useForm({
    initialValues: {
      amPm: initialTimeData.amPm,
      channelID,
      hour: initialTimeData.hour,
      ignoreLeaders: !!ignoreLeaders,
      ignoreWhenCrossedFinishLine: !!ignoreWhenCrossedFinishLine,
    },
    validate: {
      hour: (val) => (!val ? "You must select an hour." : null),
    },
  })

  const handleOpen = () => {
    open()
  }

  const handleChannelSelect = (id) => {
    form.setValues({ channelID: id })
  }

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return

    setLoading(true)

    const {
      amPm,
      channelID,
      hour: hourInput,
      ignoreLeaders: ignoreLeadersInput,
      ignoreWhenCrossedFinishLine: ignoreWhenCrossedFinishLineInput,
    } = form.values

    // add timezone offset to hour inputted
    const offset = -getUTCOffset(usersTimezone)
    const hour = parseInt(hourInput)
    const hourUTC24 = amPm === "AM" ? hour % 12 : (hour % 12) + 12
    const utcHour = (hourUTC24 + offset) % 24

    const newNudge = {
      ...nudge,
      channelID,
      ignoreLeaders: ignoreLeadersInput,
      ignoreWhenCrossedFinishLine: ignoreWhenCrossedFinishLineInput,
      scheduledHourUTC: utcHour,
    }

    const { error } = await editScheduledNudge(id, nudge, newNudge)

    setLoading(false)

    if (error) {
      setError(error)
    } else {
      close()

      setError(null)

      onEdit(nudge, newNudge)

      notifications.show({
        autoClose: 8000,
        color: "green",
        title: "Nudge Successfully Edited!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Edit Scheduled Nudge</Title>}>
        <Stack gap="md">
          <Text fw={600} size="sm">
            {clanName}
          </Text>

          <Group wrap="nowrap">
            <Select
              data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
              label="Hour"
              placeholder="Select hour"
              size="md"
              withAsterisk
              {...form.getInputProps("hour")}
              allowDeselect={false}
            />
            <Select
              data={["AM", "PM"]}
              label="AM/PM"
              placeholder="Select AM/PM"
              size="md"
              withAsterisk
              {...form.getInputProps("amPm")}
              allowDeselect={false}
            />
          </Group>

          <Text c="dimmed" fw={600} size="xs">
            Timezone: {usersTimezone}
          </Text>

          <ChannelDropdown
            channels={channels}
            {...form.getInputProps("channelID")}
            initialId={channelID}
            noneAsOption={false}
            setChannel={handleChannelSelect}
          />

          <Title fw="600" size="h5">
            Nudge Overrides
          </Title>

          <Checkbox
            label="Ignore Co-Leaders & Leaders"
            {...form.getInputProps("ignoreLeaders", { type: "checkbox" })}
          />
          <Checkbox
            label="Don't send nudge(s) if clan has crossed finish line"
            {...form.getInputProps("ignoreWhenCrossedFinishLine", { type: "checkbox" })}
          />

          <Group justify="space-between">
            <Text c="red.6" fw="500" size="sm">
              {error}
            </Text>
            <Button loading={loading} onClick={handleSubmit}>
              Edit
            </Button>
          </Group>
        </Stack>
      </Modal>
      <ActionIcon aria-label="Edit Scheduled Nudge" color="pink" onClick={handleOpen} variant="light">
        <IconPencil size="1.25rem" />
      </ActionIcon>
    </>
  )
}
