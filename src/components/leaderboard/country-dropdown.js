"use client"

import { Combobox, Group, InputBase, Text, useCombobox } from "@mantine/core"
import { forwardRef, useImperativeHandle, useState } from "react"

import locations from "@/static/locations"

import Image from "../ui/image"

const countries = locations.map((l) => ({
  component: (
    <Group gap="xs" wrap="nowrap">
      <Image alt="Flag" height={16} src={`/assets/flag-icons/${l.key.toLowerCase()}.webp`} />
      <Text fz="0.8rem">{l.name}</Text>
    </Group>
  ),
  id: l.id,
  key: l.key,
  name: l.name,
  query: l.name.toLowerCase(),
}))

function CountryDropdown({ handleOptionSelect, initialKey }, ref) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const [search, setSearch] = useState(initialKey ? countries.find((c) => c.key === initialKey)?.name || "" : "")
  const [key, setKey] = useState(initialKey)

  const filteredOptions = countries.filter((c) => c.query.includes(search.toLowerCase().trim()))

  const options = filteredOptions.map((c) => (
    <Combobox.Option key={c.key} value={c.key}>
      {c.component}
    </Combobox.Option>
  ))

  useImperativeHandle(ref, () => ({
    reset: () => {
      setKey(null)
      setSearch("")
    },
  }))

  return (
    <Combobox
      maw="20rem"
      middlewares={{ flip: false }}
      onOptionSubmit={(val) => {
        combobox.closeDropdown()
        setKey(val)

        const selectedCountry = countries.find((c) => c.key === val)
        setSearch(selectedCountry ? selectedCountry.name : "")

        handleOptionSelect(val, selectedCountry.id)
      }}
      store={combobox}
      style={{ flexGrow: 1 }}
    >
      <Combobox.Target>
        <InputBase
          onBlur={() => {
            combobox.closeDropdown()
            setSearch(key ? countries.find((c) => c.key === key)?.name || "" : "")
          }}
          onChange={(event) => {
            combobox.updateSelectedOptionIndex()
            setSearch(event.currentTarget.value)
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          placeholder="Select region"
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
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

export default forwardRef(CountryDropdown)
