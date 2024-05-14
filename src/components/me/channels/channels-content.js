"use client"

import { Button, Container, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useMemo, useState } from "react"
import Select from "react-select"

import { setChannels } from "@/actions/server"
import InfoPopover from "@/components/ui/info-popover"

import ChannelDropdown from "../home/channel-dropdown"
import SaveSettingsDialog from "../save-settings-dialog"
import classes from "./channels.module.css"

const channelTypes = [
  {
    description:
      "The channel where players will be allowed to use /apply. Generally, this channel is where new members of your server will be directed to apply to your clan.",
    title: "Apply Channel",
    type: "applyChannelID",
  },
  {
    description: "The channel where applications will be posted when a player uses /apply.",
    title: "Applications Channel",
    type: "applicationsChannelID",
  },
  {
    description: "The channel where your war report will be posted.",
    title: "Report Channel",
    type: "reportChannelID",
  },
]

export default function ChannelsContent({ channels, guild }) {
  const [savedState, setSavedState] = useState({
    applicationsChannelID: guild?.channels?.applicationsChannelID || "",
    applyChannelID: guild?.channels?.applyChannelID || "",
    commandChannelIDs: guild?.channels?.commandChannelIDs || [],
    commandChannelKeyword: guild?.channels?.commandChannelKeyword || "",
    reportChannelID: guild?.channels?.reportChannelID || "",
  })
  const [unsavedState, setUnsavedState] = useState({
    applicationsChannelID: guild?.channels?.applicationsChannelID || "",
    applyChannelID: guild?.channels?.applyChannelID || "",
    commandChannelIDs: guild?.channels?.commandChannelIDs || [],
    commandChannelKeyword: guild?.channels?.commandChannelKeyword || "",
    reportChannelID: guild?.channels?.reportChannelID || "",
  })
  const [opened, { close, open }] = useDisclosure(false)
  const [showButton, setShowButton] = useState(false)
  const [keywordError, setKeywordError] = useState("")

  const handleChannelChange = (type, id) => {
    const newUnsavedState = { ...unsavedState }
    newUnsavedState[type] = id === "none" ? "" : id
    setUnsavedState(newUnsavedState)

    if (
      savedState?.applicationsChannelID === newUnsavedState?.applicationsChannelID &&
      savedState?.applyChannelID === newUnsavedState?.applyChannelID &&
      savedState?.reportChannelID === newUnsavedState?.reportChannelID
    ) {
      close()
    } else open()
  }

  const handleModalSave = () => {
    close()

    const channelQuery = {
      ...unsavedState,
      commandChannelIDs: savedState.commandChannelIDs,
      commandChannelKeyword: savedState.commandChannelKeyword,
    }

    setSavedState(channelQuery)
    setChannels(guild.guildID, channelQuery)
  }

  const handleButtonSave = async () => {
    const channelQuery = {
      ...savedState,
      commandChannelIDs: unsavedState.commandChannelIDs,
      commandChannelKeyword: unsavedState.commandChannelKeyword,
    }

    const { error } = await setChannels(guild.guildID, channelQuery)

    if (error) {
      setKeywordError(error)
      return
    }

    setKeywordError("")
    setSavedState(channelQuery)
    setShowButton(false)
  }

  const hanldeKeywordChange = (e) => {
    const val = e.currentTarget.value.toLowerCase()

    const newUnsavedState = { ...unsavedState }
    newUnsavedState.commandChannelKeyword = val
    setUnsavedState(newUnsavedState)

    if (val !== savedState.commandChannelKeyword) setShowButton(true)
    else {
      setShowButton(false)
      setKeywordError("")
    }
  }

  const handleCommandChannelChange = (options) => {
    const ids = options.map((o) => o.value)
    const newUnsavedState = { ...unsavedState }
    newUnsavedState.commandChannelIDs = ids
    setUnsavedState(newUnsavedState)

    if (ids.length !== savedState.commandChannelIDs.length) {
      setShowButton(true)
      return
    }

    for (const id of ids) {
      if (!savedState.commandChannelIDs.includes(id)) {
        setShowButton(true)
        return
      }
    }

    setShowButton(false)
  }

  const textChannelOptions = useMemo(
    () =>
      channels
        .filter((c) => c.type === 0)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({
          label: `# ${c.name}`,
          value: c.id,
        })),
    [],
  )

  const defaultChannelValues = useMemo(
    () =>
      savedState.commandChannelIDs.map((id) => {
        const label = `# ${channels.find((c) => c.id === id)?.name || "deleted-channel"}`

        return {
          label,
          value: id,
        }
      }),
    [],
  )

  return (
    <>
      <Container py="xl" size="lg">
        <Stack gap="3rem">
          <Stack>
            <Title size="h3">Channels</Title>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              {channelTypes.map((c) => (
                <Paper align="center" bg="gray.8" component={Stack} key={c.type} p="md" radius="md">
                  <Group gap="xs">
                    <Text fw={600} size="lg">
                      {c.title}
                    </Text>
                    <InfoPopover iconSize="1rem" text={c.description} />
                  </Group>
                  <ChannelDropdown
                    channels={channels}
                    initialId={guild.channels[c.type]}
                    label=""
                    noneAsOption
                    placeholder="None"
                    setChannel={(id) => handleChannelChange(c.type, id)}
                  />
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
          <Stack>
            <Group gap="xs">
              <Title size="h3">Commands</Title>
              <InfoPopover text="Set specific channels where the bot can be used to reduce spam in unwanted channels." />
            </Group>
            <Stack bg="gray.8" component={Paper} gap="xl" p="lg">
              <Group>
                <Group gap="xs">
                  <Title fw={600} size="sm">
                    Channel Keyword
                  </Title>
                  <InfoPopover text="Allow users to use commands in all channels containing a set keyword. Case insensitive. Commonly used for 'ticket' channels." />
                </Group>

                <TextInput
                  leftSectionPointerEvents="none"
                  maxLength={10}
                  onChange={hanldeKeywordChange}
                  placeholder="keyword"
                  size="sm"
                  value={unsavedState.commandChannelKeyword}
                  w="8rem"
                />

                <Text c="red.6" size="sm">
                  {keywordError}
                </Text>
              </Group>

              <Stack>
                <Group gap="xs">
                  <Title fw={600} size="sm">
                    Allowed Channels
                  </Title>
                  <InfoPopover text="Select specific channels that commands can be used in. If no keyword or specific channels are set, the bot will be able to be used in any channel." />
                </Group>
                <Select
                  className={classes.customSelect}
                  defaultValue={defaultChannelValues}
                  isClearable
                  isMulti
                  isOptionDisabled={(o) =>
                    savedState.commandChannelKeyword && o.label.includes(savedState.commandChannelKeyword)
                  }
                  isSearchable={false}
                  onChange={handleCommandChannelChange}
                  options={textChannelOptions}
                  placeholder="Set command channels..."
                />
              </Stack>

              <Group justify="flex-end">
                <Button disabled={!showButton} onClick={handleButtonSave}>
                  Save
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <SaveSettingsDialog isOpen={opened} onClose={close} onSave={handleModalSave} />
    </>
  )
}
