"use client"

import { Autocomplete, Button, Group, Modal, rem, SegmentedControl, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"

import { searchClans } from "../../actions/supercell"

export default function SearchByClanModal() {
  const [query, setQuery] = useState("")
  const [clans, setClans] = useState([])
  const [opened, { close, open }] = useDisclosure(false)

  // starting at 3 chars, debounce to every x ms
  const handleChange = async (val) => {
    setQuery(val)
    setClans([])

    if (val.length < 3) return

    const { data, status } = await searchClans(val)

    if (status === 200) setClans(data.map((c) => c.name))
  }

  return (
    <>
      <Modal centered onClose={close} opened={opened} title={<Title fz="1.25rem">Find Player by Clan</Title>}>
        <Autocomplete
          data={clans}
          label="Clan Name"
          leftSection={<IconSearch style={{ height: rem(16), width: rem(16) }} />}
          onChange={handleChange}
          placeholder="Search clans..."
          required
          value={query}
        />
      </Modal>
      <Button onClick={open} variant="default" w="fit-content">
        Search by clan?
      </Button>
    </>
  )
}
