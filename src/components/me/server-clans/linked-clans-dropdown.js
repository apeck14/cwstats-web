"use client"

import { Combobox, Group, InputBase, Text, useCombobox } from "@mantine/core"
import { useState } from "react"

import Image from "../../ui/image"

export default function LinkedClansDropdown({ handleOptionSelect, linkedClans }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [value, setValue] = useState(null)

  const options = linkedClans.map((c) => (
    <Combobox.Option key={c.tag} value={c.tag}>
      <Group gap="0.25rem" wrap="nowrap">
        <Image alt="Flag" height={18} src={`/assets/badges/${c.clanBadge}.webp`} />
        <Text fw="600" size="sm">
          {c.clanName}
        </Text>
      </Group>
    </Combobox.Option>
  ))

  return (
    <Combobox
      middlewares={{ flip: false }}
      onOptionSubmit={(val) => {
        const clanName = linkedClans.find((c) => c.tag === val)?.clanName || "Unknown Clan"
        combobox.closeDropdown()
        handleOptionSelect(val)
        setValue(clanName)
      }}
      store={combobox}
      style={{ flexGrow: 1 }}
    >
      <Combobox.Target>
        <InputBase
          label="Linked Clan"
          onBlur={() => {
            combobox.closeDropdown()
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          placeholder="Select clan"
          readOnly
          required
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          size="md"
          value={value}
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
