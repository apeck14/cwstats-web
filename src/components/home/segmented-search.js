"use client"

import { SegmentedControl } from "@mantine/core"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import DebouncedSearch from "../ui/debounced-search"

export default function SegmentedSearch() {
  const [currentSegment, setCurrentSegment] = useState("Clans")
  const onSegmentChange = (val) => {
    setCurrentSegment(val)
  }
  const router = useRouter()

  const handleSelect = (option) => {
    const formattedTag = option?.tag?.substring(1)
    router.push(`/${currentSegment === "Clans" ? "clan" : "player"}/${formattedTag}`)
  }

  return (
    <>
      <SegmentedControl
        color={currentSegment === "Clans" ? "pink.6" : "orange.5"}
        data={["Clans", "Players"]}
        onChange={onSegmentChange}
        radius="sm"
        size="xs"
        w="8rem"
      />
      <DebouncedSearch
        autoFocus={false}
        isClans={currentSegment === "Clans"}
        onSelect={handleSelect}
        placeholder="Search by name or tag, e.g. ABC123"
        showMoreResults
      />
    </>
  )
}
