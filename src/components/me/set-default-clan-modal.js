"use client"

import { Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconHash } from "@tabler/icons-react"
import { useState } from "react"

import { setDefaultClan } from "../../actions/server"
import { formatTag } from "../../lib/functions/utils"

export default function SetDefaultClanModal({ id, setDefClan }) {
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)

  const handleOpen = () => {
    setTag("")
    setError("")
    open()
  }

  const handleTagChange = (e) => {
    const val = formatTag(e.currentTarget.value)

    // empty textbox
    if (!val) {
      setTag("")
      return
    }

    if (val !== tag) {
      if (error) setError("")
      setTag(val)
    }
  }

  const handleSubmit = async () => {
    if (tag.length < 5) {
      setError("Clan tag is too short.")
      return
    }

    setLoading(true)

    const { message, name, success } = await setDefaultClan(id, tag)

    setLoading(false)

    if (!success) {
      setError(message)
    } else {
      close()
      setDefClan({ name, tag: formatTag(tag, true) })
      notifications.show({
        autoClose: 5000,
        color: "green",
        message: `${name} has been set as the server default.`,
        title: "Default Clan Set!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Add Abbreviation</Title>}>
        <Stack gap="md">
          <TextInput
            error={error}
            label="Clan Tag"
            leftSection={<IconHash />}
            leftSectionPointerEvents="none"
            maxLength={9}
            onChange={handleTagChange}
            placeholder="ABC123"
            size="md"
            value={tag}
            variant="filled"
            withAsterisk
          />

          <Group justify="flex-end">
            <Button color="pink" loading={loading} onClick={handleSubmit}>
              Set
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button fz="0.9rem" onClick={handleOpen} size="xs" variant="light" w="fit-content">
        Set Default Clan
      </Button>
    </>
  )
}
