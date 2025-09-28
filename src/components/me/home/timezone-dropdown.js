"use client"

import { Select } from "@mantine/core"
import { IconTimezone } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import timezones from "@/static/timezones.json"

export default function TimezoneSelect({ setTimezone, timezone }) {
  // Find the matching dropdown string for the given timezone
  const findDropdownValue = (tz) => timezones.find((item) => item.startsWith(tz)) || ""

  const [selectedTimezone, setSelectedTimezone] = useState(findDropdownValue(timezone))

  // Update parent whenever selection changes
  const handleChange = (value) => {
    setSelectedTimezone(value)
    if (setTimezone) setTimezone(value)
  }

  // Sync local state if parent changes
  useEffect(() => {
    const newValue = findDropdownValue(timezone)
    if (newValue && newValue !== selectedTimezone) {
      setSelectedTimezone(newValue)
    }
  }, [timezone])

  return (
    <Select
      data={timezones}
      leftSection={<IconTimezone />}
      maw="17rem"
      onChange={handleChange}
      placeholder="Select timezone"
      searchable
      size="md"
      value={selectedTimezone}
    />
  )
}
