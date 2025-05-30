"use client"

import { Button, Group, List, Modal, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconHash } from "@tabler/icons-react"
import { useState } from "react"

import { addPlus } from "@/actions/upgrade"
import { formatTag } from "@/lib/functions/utils"

import InfoPopover from "../ui/info-popover"

export default function PlusFormModal() {
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opened, { close, open }] = useDisclosure(false)

  const handleOpen = () => {
    setTag("")
    setError("")
    open()
  }

  const handleChange = (e) => {
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
    if (tag.length < 3) {
      setError("Invalid clan tag.")
      return
    }

    setLoading(true)

    const { error, name } = await addPlus(tag)

    setLoading(false)

    if (error) setError(error)
    else {
      close()
      notifications.show({
        autoClose: 8000,
        color: "green",
        message: `${name} will now have full access to all CWStats+ perks.`,
        title: "CWStats+ Activated!",
      })
    }
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.5rem">Activate CWStats+</Title>}>
        <Stack gap="md">
          <List
            center
            icon={
              <ThemeIcon color="orange.5" radius="xl" size={20}>
                <IconCheck size="1rem" />
              </ThemeIcon>
            }
            size="sm"
            spacing="xs"
          >
            <List.Item>
              <Group gap="0.1rem">
                <Text fz="sm">
                  Add <b>CWStats.com</b> to your clan&apos;s description
                </Text>
                <InfoPopover
                  color="var(--mantine-color-orange-5)"
                  iconSize="0.9rem"
                  text="Family friendly clans can use CWStats or CW-Stats instead."
                />
              </Group>
            </List.Item>
            <List.Item>Enter your clan&apos;s tag below</List.Item>
            <List.Item>
              Click <b>Activate</b> 🎉
            </List.Item>
          </List>
          <TextInput
            data-autofocus
            error={error}
            label="Clan Tag"
            leftSection={<IconHash />}
            leftSectionPointerEvents="none"
            maxLength={10}
            onChange={handleChange}
            placeholder="ABC123"
            size="md"
            value={tag}
            variant="filled"
            withAsterisk
          />

          <Group justify="flex-end">
            <Button color="orange.5" loading={loading} onClick={handleSubmit} w="6rem">
              Activate
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button
        className="buttonHover"
        gradient={{ deg: 180, from: "orange.5", to: "orange.6" }}
        onClick={handleOpen}
        variant="gradient"
        w="100%"
      >
        Activate
      </Button>
    </>
  )
}
