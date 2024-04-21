"use client"

import { Checkbox, Group, Stack, Textarea, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useEffect, useState } from "react"

import { updateNudgeSettings } from "@/actions/server"
import InfoPopover from "@/components/ui/info-popover"
import { DEFAULT_NUDGE_MESSAGE } from "@/static/constants"

import SaveSettingsDialog from "../save-settings-dialog"

export default function Settings({ guild }) {
  const { guildID, nudges } = guild

  const [savedState, setSavedState] = useState({
    ignoreLeaders: !!nudges?.ignoreLeaders,
    message: nudges?.message || "",
  })
  const [ignoreLeaders, setIgnoreLeaders] = useState(!!nudges?.ignoreLeaders)
  const [message, setMessage] = useState(nudges?.message || "")
  const [opened, { close, open }] = useDisclosure(false)

  const handleSave = () => {
    close()
    setSavedState({ ignoreLeaders, message })
    updateNudgeSettings(guildID, { ignoreLeaders, message })
  }

  const handleCheck = (e) => {
    setIgnoreLeaders(e.currentTarget.checked)
  }

  const handleMessageChange = (e) => {
    setMessage(e.currentTarget.value)
  }

  useEffect(() => {
    const statesAreEqual = message === savedState.message && ignoreLeaders === savedState.ignoreLeaders
    if (statesAreEqual) close()
    else open()
  }, [ignoreLeaders, message])

  return (
    <Stack>
      <Group gap="xs">
        <Title size="h3">Settings</Title>
        <InfoPopover text="These settings will be applied to both /nudge & scheduled nudges." />
      </Group>

      <Checkbox checked={ignoreLeaders} label="Ignore Co-Leaders & Leaders" onChange={handleCheck} />
      <Textarea
        autosize
        description="Optional. Default nudge message will be used if none provided."
        label="Custom Message"
        maxLength={200}
        maxRows={3}
        minRows={2}
        onChange={handleMessageChange}
        placeholder={DEFAULT_NUDGE_MESSAGE}
        value={message}
      />

      <SaveSettingsDialog isOpen={opened} onClose={close} onSave={handleSave} />
    </Stack>
  )
}
