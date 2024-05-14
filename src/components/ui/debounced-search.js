"use client"

import { Combobox, Group, InputBase, Loader, rem, Text, useCombobox } from "@mantine/core"
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"

import { getPlayersByQuery } from "@/actions/api"
import { searchClans } from "@/actions/supercell"
import { getClanBadgeFileName } from "@/lib/functions/utils"

import Image from "./image"

export default function DebouncedSearch({
  autoFocus = true,
  isClans,
  label,
  onSelect,
  placeholder,
  required,
  searchIconSize,
  size,
}) {
  const inputRef = useRef(null)
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
    },
  })

  const [search, setSearch] = useState("")
  const [debounced] = useDebouncedValue(search, 600)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery("(max-width: 30em)")

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

  const blurInputFocus = () => {
    inputRef.current.blur()
  }

  const clanBadgePx = isMobile ? 28 : 32

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
          autoFocus={autoFocus}
          data-autofocus={autoFocus}
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
          ref={inputRef}
          required={required}
          size={size || "md"}
          value={search}
        />
      </Combobox.Target>

      {showDropdown && (
        <Combobox.Dropdown>
          <Combobox.Options>
            {results.length === 0 ? (
              <Combobox.Empty c="white">No Results</Combobox.Empty>
            ) : (
              results.map((r) => (
                <Combobox.Option
                  component={Group}
                  justify="space-between"
                  key={r.tag}
                  onClick={blurInputFocus}
                  value={r.tag}
                  wrap="nowrap"
                >
                  <Group gap="xs">
                    {isClans && (
                      <Image
                        alt="Clan Badge"
                        height={clanBadgePx}
                        src={`/assets/badges/${getClanBadgeFileName(r.badgeId, r.clanWarTrophies)}.webp`}
                        unoptimized
                        width={clanBadgePx}
                      />
                    )}
                    <Text fw={600}>{r.name}</Text>
                  </Group>
                  <Text c="gray.1" miw="fit-content" size="sm">
                    {isClans ? r.tag : r.clanName}
                  </Text>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      )}
    </Combobox>
  )
}
