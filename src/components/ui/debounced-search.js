"use client"

import { Combobox, Group, InputBase, Loader, rem, Text, useCombobox } from "@mantine/core"
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next-nprogress-bar"
import { useEffect, useRef, useState } from "react"

import { getPlayersByQuery } from "@/actions/api"
import { searchClans } from "@/actions/supercell"
import { getClanBadgeFileName } from "@/lib/functions/utils"

import Image from "./image"

export default function DebouncedSearch({
  autoFocus = true,
  enterRedirects = false,
  isClans,
  label,
  onSelect,
  placeholder,
  required,
  searchIconSize,
  showMoreResults = false,
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
  const router = useRouter()

  const showDropdown = search && debounced && !loading

  const updateResults = async () => {
    if (debounced.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    const { data, players, status, success } = await (isClans
      ? searchClans({ limit: 5, name: debounced })
      : getPlayersByQuery(debounced))
    setLoading(false)

    if (success || status === 200) {
      combobox.openDropdown()
      setResults(isClans ? data : players)
    }
  }

  useEffect(() => {
    updateResults()
  }, [debounced])

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
          onKeyDown={(e) => {
            if (enterRedirects && e.key === "Enter") {
              router.push(`/${isClans ? "clan" : "player"}/search?name=${search}`)
            }
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
              <Combobox.Empty c="white" fw="600">
                No Results
              </Combobox.Empty>
            ) : (
              results.map((r) => (
                <Combobox.Option
                  component={Group}
                  justify="space-between"
                  key={r.tag}
                  onClick={() => inputRef.current.blur()}
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
          {showMoreResults && results.length >= 5 && (
            <Combobox.Footer fw="600">
              <Link
                className="pinkText"
                href={`/${isClans ? "clan" : "player"}/search?name=${debounced}`}
                w="fit-content"
              >
                View all results...
              </Link>
            </Combobox.Footer>
          )}
        </Combobox.Dropdown>
      )}
    </Combobox>
  )
}
