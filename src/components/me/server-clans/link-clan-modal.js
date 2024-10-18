"use client"

import { Button, Divider, Group, List, Modal, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconHash } from "@tabler/icons-react"
import { useState } from "react"

import { generateLinkCode, linkClanToServer } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import { formatTag } from "@/lib/functions/utils"

export default function LinkClanModal({ clans, id, setClans }) {
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")
  const [lError, setlError] = useState("")
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)
  const [code, setCode] = useState(null)

  const handleOpen = () => {
    setCode(null)
    setTag("")
    setError("")
    setlError("")
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
      setCode(null)
      setTag(val)
    }
  }

  const handleGenerateCode = async () => {
    if (tag.length < 3) {
      setError("Invalid clan tag.")
      return
    }

    setGLoading(true)

    const { code, error } = await generateLinkCode(id, tag)

    if (error) setError(error)

    setCode(code)
    setGLoading(false)
  }

  const handleSubmit = async () => {
    if (tag.length < 3) {
      setError("Invalid clan tag.")
      return
    }

    setLoading(true)

    const { clan, error } = await linkClanToServer(id, tag)

    setLoading(false)

    if (error) setlError(error)
    else {
      close()
      setClans([...clans, clan])
      notifications.show({
        autoClose: 8000,
        color: "green",
        message: `${clan.clanName} has been successfully linked to this server.`,
        title: "Clan Linked!",
      })

      sendLogWebhook(
        {
          clan: clan.clanName,
          guild: id,
          tag: formatTag(tag, true),
          title: "Clan Linked",
        },
        true,
      )
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Link Clan to Server</Title>}>
        <Stack gap="md">
          <TextInput
            data-autofocus
            error={error}
            label="Clan Tag"
            leftSection={<IconHash />}
            leftSectionPointerEvents="none"
            maxLength={10}
            onChange={handleTagChange}
            placeholder="ABC123"
            size="md"
            value={tag}
            variant="filled"
            withAsterisk
          />

          <Divider color="gray.6" size="sm" />

          <Title size="h5">Steps to Link</Title>

          <List
            center
            icon={
              <ThemeIcon color="orange" radius="xl" size={20}>
                <IconCheck size="1rem" />
              </ThemeIcon>
            }
            size="sm"
            spacing="xs"
          >
            <List.Item>
              <b>Generate</b> a code below
            </List.Item>

            <List.Item>
              Add the code to your clan&apos;s <b>description</b>
            </List.Item>

            <List.Item>
              Click <b>Link</b> 🎉
            </List.Item>

            <List.Item>
              Remove the code from your clan&apos;s <b>description</b>
            </List.Item>
          </List>

          {code ? (
            <Stack gap="0">
              <Title>Code: {code}</Title>
              <Text c="dimmed" fw="500" size="sm">
                This code expires in 10 minutes. Supercell will take a few minutes to update your description.
              </Text>
            </Stack>
          ) : (
            <Button color="orange" loading={gLoading} maw="fit-content" onClick={handleGenerateCode} size="xs">
              Generate Code
            </Button>
          )}

          <Group justify="space-between">
            <Text c="red.6" fw="600" size="sm">
              {lError}
            </Text>

            <Button disabled={!code} loading={loading} onClick={handleSubmit}>
              Link
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button disabled={clans.length >= 20} fz="0.9rem" onClick={handleOpen} size="xs">
        Link
      </Button>
    </>
  )
}
