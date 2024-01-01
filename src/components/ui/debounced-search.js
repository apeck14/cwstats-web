"use client"

import { Combobox, Group, InputBase, Loader, rem, Text, useCombobox } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { getPlayersByQuery } from "../../actions/api"
import { searchClans } from "../../actions/supercell"
import useWindowSize from "../../hooks/useWindowSize"
import { breakpointObj, getClanBadgeFileName } from "../../lib/functions"
import Image from "./image"

export default function DebouncedSearch({ isClans, label, onSelect, placeholder, required, searchIconSize, size }) {
  const { breakpoint } = useWindowSize()
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
    },
  })

  const [search, setSearch] = useState("")
  const [debounced] = useDebouncedValue(search, 600)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const showDropdown = search && debounced && !loading

  const updateResults = async () => {
    if (debounced.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    const { data, players, status, success } = await (isClans ? searchClans(debounced) : getPlayersByQuery(debounced))
    setLoading(false)

    if (success || status === 200) {
      combobox.openDropdown()
      setResults(isClans ? data : players)
    }
  }

  useEffect(() => {
    updateResults()
  }, [debounced])

  const clanBadgePx = breakpointObj(28, 28, 32)[breakpoint]

  return (
    <Combobox
      onOptionSubmit={(val) => {
        combobox.closeDropdown()
        const option = results.find((o) => o.tag === val)
        onSelect(option)
      }}
      position="bottom"
      store={combobox}
    >
      <Combobox.Target>
        <InputBase
          autoFocus
          label={label}
          leftSection={
            loading ? (
              <Loader size="xs" />
            ) : (
              <IconSearch style={{ height: rem(searchIconSize || 16), width: rem(searchIconSize || 16) }} />
            )
          }
          onChange={(e) => {
            combobox.updateSelectedOptionIndex()
            setSearch(e.currentTarget.value)
          }}
          placeholder={placeholder || `Search ${isClans ? "clans" : "players"}...`}
          required={required}
          size={size || "md"}
          value={search}
        />
      </Combobox.Target>

      {showDropdown && (
        <Combobox.Dropdown>
          <Combobox.Options>
            {results.length === 0 ? (
              <Combobox.Empty>No Results</Combobox.Empty>
            ) : (
              results.map((r) => (
                <Combobox.Option key={r.tag} value={r.tag}>
                  <Group justify="space-between">
                    <Group>
                      {isClans && (
                        <Image
                          height={clanBadgePx}
                          src={`/assets/badges/${getClanBadgeFileName(r.badgeId, r.clanWarTrophies)}.png`}
                          width={clanBadgePx}
                        />
                      )}
                      <Text fw={600}>{r.name}</Text>
                    </Group>
                    <Text c="gray.1" size="sm">
                      {isClans ? r.tag : r.clanName}
                    </Text>
                  </Group>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      )}
    </Combobox>
  )
}
