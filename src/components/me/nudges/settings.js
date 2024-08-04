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
    ignoreWhenCrossedFinishLine: !!nudges?.ignoreWhenCrossedFinishLine,
    message: nudges?.message || "",
  })
  const [ignoreLeaders, setIgnoreLeaders] = useState(!!nudges?.ignoreLeaders)
  const [ignoreWhenCrossedFinishLine, setIgnoreWhenCrossedFinishLine] = useState(!!nudges?.ignoreWhenCrossedFinishLine)
  const [message, setMessage] = useState(nudges?.message || "")
  const [opened, { close, open }] = useDisclosure(false)

  const handleSave = () => {
    close()
    setSavedState({ ignoreLeaders, ignoreWhenCrossedFinishLine, message })
    updateNudgeSettings(guildID, { ignoreLeaders, ignoreWhenCrossedFinishLine, message })
  }

  const handleIgnoreLeadersCheck = (e) => {
    setIgnoreLeaders(e.currentTarget.checked)
  }

  const handleIgnoreWhenCrossedFinishLineCheck = (e) => {
    setIgnoreWhenCrossedFinishLine(e.currentTarget.checked)
  }

  const handleMessageChange = (e) => {
    setMessage(e.currentTarget.value)
  }

  useEffect(() => {
    const statesAreEqual =
      message === savedState.message &&
      ignoreLeaders === savedState.ignoreLeaders &&
      ignoreWhenCrossedFinishLine === savedState.ignoreWhenCrossedFinishLine
    if (statesAreEqual) close()
    else open()
  }, [ignoreLeaders, message, ignoreWhenCrossedFinishLine])

  return (
    <Stack mih="15rem">
      <Group gap="xs">
        <Title size="h3">Settings</Title>
        <InfoPopover text="These settings will be applied to both /nudge & scheduled nudges." />
      </Group>

      <Checkbox checked={ignoreLeaders} label="Ignore Co-Leaders & Leaders" onChange={handleIgnoreLeadersCheck} />
      <Checkbox
        checked={ignoreWhenCrossedFinishLine}
        label="Don't send nudge(s) if clan has crossed finish line"
        onChange={handleIgnoreWhenCrossedFinishLineCheck}
      />

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
