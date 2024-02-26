import { Button, Combobox, Group, InputBase, Loader, Stack, Text, TextInput, useCombobox } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { IconHash, IconSearch } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"

import { searchGuildUsers } from "@/actions/discord"
import { addLinkedAccount } from "@/actions/server"
import { formatTag } from "@/lib/functions/utils"

export default function AddLinkedAccount({ disabled, id, linkedAccounts, setLinkedAccounts }) {
  const inputRef = useRef(null)
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
    },
  })
  const [error, setError] = useState("")
  const [discordID, setDiscordID] = useState("")
  const [tag, setTag] = useState("")
  const [search, setSearch] = useState("")
  const [debounced] = useDebouncedValue(search, 600)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleAdd = async () => {
    if (!search || !tag) {
      setError("Missing Discord user or player tag.")
      return
    }

    if (!discordID) {
      setError("No Discord user selected.")
      return
    }

    setLoading(true)
    const { message, name, success } = await addLinkedAccount(id, tag, discordID)
    setLoading(false)

    if (!success) {
      setError(message)
    } else {
      setLinkedAccounts([...linkedAccounts, { discordID, name, tag: formatTag(tag, true) }])
      setError("")
      setDiscordID("")
      setTag("")
      setSearch("")
      setResults([])
      setClicked(false)
    }
  }

  const handleTagChange = (e) => {
    const formattedTag = formatTag(e.currentTarget.value)
    setTag(formattedTag)
  }

  const showDropdown = search && debounced && !searchLoading && !clicked

  const updateResults = async () => {
    if (debounced.length < 2) {
      setResults([])
      return
    }

    setSearchLoading(true)
    const { data, message, success } = await searchGuildUsers(id, search)
    setSearchLoading(false)

    if (!success) setError(message)
    else {
      combobox.openDropdown()
      setResults(data)
    }
  }

  useEffect(() => {
    updateResults()
  }, [debounced])

  const blurInputFocus = () => {
    inputRef.current.blur()
  }

  return (
    <Stack>
      <Group align="flex-end">
        <Combobox
          onOptionSubmit={(val) => {
            combobox.closeDropdown()
            const option = results.find((o) => o.user.id === val)
            setDiscordID(option.user.id)
            setSearch(option.user.username)
            setClicked(true)
          }}
          position="bottom"
          store={combobox}
        >
          <Combobox.Target>
            <InputBase
              label="Discord User"
              leftSection={searchLoading ? <Loader size="xs" /> : <IconSearch size="1rem" />}
              onChange={(e) => {
                combobox.updateSelectedOptionIndex()
                setSearch(e.currentTarget.value)
                setClicked(false)
              }}
              placeholder="Search Users..."
              ref={inputRef}
              required
              size="sm"
              value={search}
              withAsterisk
            />
          </Combobox.Target>

          {showDropdown && (
            <Combobox.Dropdown>
              <Combobox.Options>
                {results.length === 0 ? (
                  <Combobox.Empty c="white">No Results</Combobox.Empty>
                ) : (
                  results.map((u) => (
                    <Combobox.Option key={u.user.id} onClick={blurInputFocus} value={u.user.id} wrap="nowrap">
                      <Text fw={600}>{u.user.username}</Text>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          )}
        </Combobox>
        <TextInput
          label="Player Tag"
          leftSection={<IconHash size="1rem" />}
          leftSectionPointerEvents="none"
          maxLength={9}
          onChange={handleTagChange}
          placeholder="ABC123"
          size="sm"
          value={tag}
          w="8rem"
          withAsterisk
        />
        <Button disabled={disabled} onClick={handleAdd}>
          {loading ? <Loader color="white" size="xs" /> : "Add"}
        </Button>
      </Group>
      <Text c="red.6" size="sm">
        {error}
      </Text>
    </Stack>
  )
}
