"use client"

import { Combobox, InputBase, Text, useCombobox } from "@mantine/core"
import { IconHash } from "@tabler/icons-react"
import { useMemo, useState } from "react"

export default function ChannelDropdown({ channels, error, setChannel }) {
  const combobox = useCombobox()
  const [search, setSearch] = useState("")

  const textChannels = useMemo(
    () =>
      channels
        .filter((c) => c.type === 0)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({
          component: (
            <Text>
              <span style={{ color: "var(--mantine-color-orange-6)", marginRight: "0.25rem" }}>#</span>
              {c.name}
            </Text>
          ),
          id: c.id,
          name: c.name,
        })),
    [],
  )

  const filteredOptions = textChannels.filter((c) => c.name.includes(search.toLowerCase().trim()))

  const options = filteredOptions.map((c) => (
    <Combobox.Option key={c.id} value={c.id}>
      {c.component}
    </Combobox.Option>
  ))

  const handleOptionSelect = (id) => {
    setSearch(textChannels.find((c) => c.id === id).name)
    setChannel(id)
  }

  return (
    <Combobox
      label="Channels"
      middlewares={{ flip: false }}
      onOptionSubmit={(val) => {
        combobox.closeDropdown()
        handleOptionSelect(val)
      }}
      store={combobox}
      style={{ flexGrow: 1 }}
      withAsterisk
    >
      <Combobox.Target>
        <InputBase
          error={error}
          leftSection={<IconHash />}
          leftSectionPointerEvents="none"
          onBlur={() => {
            combobox.closeDropdown()
          }}
          onChange={(event) => {
            combobox.updateSelectedOptionIndex()
            setSearch(event.currentTarget.value)
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          placeholder="Select channel"
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          size="md"
          value={search}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options.length > 0 ? options : <Combobox.Empty c="gray.1">Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
