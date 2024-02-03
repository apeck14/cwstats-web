"use client"

import { Combobox, Group, InputBase, Text, useCombobox } from "@mantine/core"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import locations from "../../../public/static/locations"
import Image from "../ui/image"

const countries = locations.map((l) => ({
  component: (
    <Group gap="xs" wrap="nowrap">
      <Image alt="Flag" height={16} src={`/assets/flag-icons/${l.key.toLowerCase()}.webp`} unoptimized />
      <Text fz="0.8rem">{l.name}</Text>
    </Group>
  ),
  key: l.key,
  name: l.name,
}))

export default function CountryDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const [search, setSearch] = useState("")

  const filteredOptions = countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase().trim()))

  const options = filteredOptions.map((c) => (
    <Combobox.Option key={c.key} value={c.key}>
      {c.component}
    </Combobox.Option>
  ))

  const handleOptionSelect = (key) => {
    const newUrl = `${pathname.slice(0, pathname.lastIndexOf("/"))}/${key.toLowerCase()}`
    router.push(`${newUrl}?${searchParams.toString()}`)
  }

  return (
    <Combobox
      maw="20rem"
      middlewares={{ flip: false }}
      onOptionSubmit={(val) => {
        combobox.closeDropdown()
        handleOptionSelect(val)
      }}
      store={combobox}
      style={{ flexGrow: 1 }}
    >
      <Combobox.Target>
        <InputBase
          onBlur={() => {
            combobox.closeDropdown()
            setSearch("")
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
