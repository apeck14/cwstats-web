"use client"

import { ActionIcon, Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconClock, IconHash } from "@tabler/icons-react"
import { useLogger } from "next-axiom"
import { useMemo, useRef, useState } from "react"

import { setWarReport } from "@/actions/server"
import { getUTCOffset } from "@/lib/functions/date-time"
import { formatTag } from "@/lib/functions/utils"

import ChannelDropdown from "./channel-dropdown"

export default function SetReportModal({ channels, id, setReport }) {
  const logger = useLogger()
  const timeRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      channel: "",
      clanTag: "",
      time: "",
    },
    validate: {
      channel: (val) => (!val ? "You must select a channel." : null),
      clanTag: (val) => (val.length < 5 ? "Clan tag is too short." : null),
      time: (val) => (!val ? "You must set a time." : null),
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

  const handleSubmit = async () => {
    if (form.validate().hasErrors) return

    setLoading(true)

    // add timezone offset to hour inputted
    const offset = getUTCOffset(usersTimezone)
    const inverseOffset = offset * -1
    const hour = parseInt(form.values.time.substring(0, 2))
    const colonIndex = form.values.time.indexOf(":")
    const minutes = parseInt(form.values.time.substring(colonIndex + 1, colonIndex + 3))

    let utcHour = hour + inverseOffset

    if (utcHour >= 24) utcHour -= 24
    else if (utcHour < 0) utcHour += 24

    const timeStr = `${utcHour < 10 ? `0${utcHour}` : utcHour}:${minutes < 10 ? `0${minutes}` : minutes}`

    const { message, name, success } = await setWarReport(id, form.values.clanTag, timeStr, form.values.channel)

    setLoading(false)

    if (!success) {
      form.setErrors({ clanTag: message })
    } else {
      const channelName = channels.find((c) => c.id === form.values.channel).name

      logger.info("War Report Time Set", { timeStr, value: form.values.time })

      close()
      setReport({
        clanTag: formatTag(form.values.clanTag, true),
        name,
        scheduledReportTimeHHMM: timeStr,
      })
      notifications.show({
        autoClose: 5000,
        color: "green",
        message: `War report successfully set to track ${name} in #${channelName}.`,
        title: "War Report Set!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Set War Report</Title>}>
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

          <TimeInput
            description={`Timezone: ${usersTimezone}`}
            label="Time"
            ref={timeRef}
            rightSection={
              <ActionIcon color="gray" onClick={() => timeRef.current?.showPicker()} variant="subtle">
                <IconClock stroke={1.5} style={{ height: "1rem", width: "1rem" }} />
              </ActionIcon>
            }
            size="md"
            type="text"
            withAsterisk
            {...form.getInputProps("time")}
          />

          <ChannelDropdown channels={channels} {...form.getInputProps("channel")} setChannel={handleChannelSelect} />

          <Group justify="flex-end">
            <Button loading={loading} onClick={handleSubmit}>
              Set
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button fz="0.9rem" onClick={handleOpen} size="xs" variant="light" w="fit-content">
        Set War Report
      </Button>
    </>
  )
}
