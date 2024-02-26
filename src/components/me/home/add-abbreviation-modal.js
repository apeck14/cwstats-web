"use client"

import { Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconHash } from "@tabler/icons-react"
import { useState } from "react"

import { addAbbreviation } from "@/actions/server"
import { formatTag } from "@/lib/functions/utils"

export default function AddAbbreviationModal({ abbreviations, id, setAbbreviations }) {
  const [tag, setTag] = useState("")
  const [abbr, setAbbr] = useState("")
  const [tagError, setTagError] = useState("")
  const [abbrError, setAbbrError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)

  const handleOpen = () => {
    setTag("")
    setAbbr("")
    setTagError("")
    setAbbrError("")
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
      if (tagError) setTagError("")
      setTag(val)
    }
  }

  const handleAbbrChange = (e) => {
    const val = e.currentTarget.value.replace(/[^a-z0-9]/gi, "")

    // empty textbox
    if (!val) {
      setAbbr("")
      return
    }

    if (val !== abbr) {
      if (abbrError) setAbbrError("")
      setAbbr(val)
    }
  }

  const handleSubmit = async () => {
    if (tag.length < 5) {
      setTagError("Invalid clan tag.")
      return
    }

    if (!abbr) {
      setAbbrError("Please set an abbreviation.")
      return
    }

    setLoading(true)

    const { message, name, success, type } = await addAbbreviation(id, abbr, tag)

    setLoading(false)

    if (!success) {
      if (type === "clan") setTagError(message)
      else setAbbrError(message)
    } else {
      const lowerCaseAbbr = abbr.toLowerCase()
      close()
      setAbbreviations([...abbreviations, { abbr: lowerCaseAbbr, name, tag: formatTag(tag, true) }])
      notifications.show({
        autoClose: 8000,
        color: "green",
        message: `${name} can now be referenced with: "${lowerCaseAbbr}".`,
        title: "New abbreviation!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Add Abbreviation</Title>}>
        <Stack gap="md">
          <TextInput
            data-autofocus
            error={tagError}
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

          <TextInput
            error={abbrError}
            label="Abbreviation"
            maxLength={4}
            onChange={handleAbbrChange}
            placeholder="abc"
            size="md"
            value={abbr}
            variant="filled"
            withAsterisk
          />

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
