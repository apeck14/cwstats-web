import { Button, Collapse, Group, RangeSlider, SimpleGrid, Slider, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconCaretDownFilled, IconCaretRightFilled, IconSearch } from "@tabler/icons-react"
import { useRouter } from "next-nprogress-bar"
import { useRef, useState } from "react"

import CountryDropdown from "@/components/leaderboard/country-dropdown"
import { getClanSearchParams } from "@/lib/functions/utils"

export default function SearchFilters({ params, resultsFound, setTrophies, trophies }) {
  const router = useRouter()
  const [opened, { toggle }] = useDisclosure(false)
  const [score, setScore] = useState(parseInt(params.minScore) || 0)
  const [members, setMembers] = useState([parseInt(params.minMembers) || 2, parseInt(params.maxMembers) || 50])
  const [query, setQuery] = useState(params.name)
  const [locationId, setLocationId] = useState(params.locationId)
  const [searchColor, setSearchColor] = useState("var(--mantine-color-gray-2)")
  const countryDropdownRef = useRef(null)
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  const handleSubmit = async () => {
    if (query.length <= 2) return

    const filterParams = {
      locationId,
      maxMembers: members[1],
      minMembers: members[0],
      minScore: score,
      name: query,
      trophies,
    }

    const newSearchParams = getClanSearchParams(filterParams)

    const params = new URLSearchParams(newSearchParams)

    router.push(`?${params.toString()}`)

    setSearchColor("var(--mantine-color-gray-2)")
  }

  const handleQueryChange = (e) => {
    const value = e.currentTarget.value.trim()
    setQuery(value)

    if (value !== params.name) setSearchColor("var(--mantine-color-pink-6)")
    else setSearchColor("var(--mantine-color-gray-2)")
  }

  const handleRegionSelect = (key, id) => {
    setLocationId(id)
  }

  const handleReset = () => {
    setTrophies(0)
    setScore(0)
    setMembers([2, 50])
    setLocationId(null)

    if (countryDropdownRef.current) {
      countryDropdownRef.current.reset()
    }
  }

  return (
    <Stack mt={{ base: "xs", md: "xl" }}>
      <TextInput
        error={query.length <= 2}
        onChange={handleQueryChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit()
          }
        }}
        rightSection={
          <IconSearch color={searchColor} onClick={handleSubmit} size="1.25rem" style={{ cursor: "pointer" }} />
        }
        size={isMobile ? "md" : "lg"}
        value={query}
      />

      <Button
        c="gray.1"
        leftSection={opened ? <IconCaretDownFilled /> : <IconCaretRightFilled />}
        maw="fit-content"
        onClick={toggle}
        p={0}
        variant="transparent"
      >
        More Filters
      </Button>

      <Collapse in={opened} transitionDuration={250} transitionTimingFunction="linear">
        <Stack gap="xl">
          <CountryDropdown handleOptionSelect={handleRegionSelect} ref={countryDropdownRef} />
          <SimpleGrid cols={isTablet ? 1 : 3}>
            <Stack gap="xs">
              <Text size="sm">Min. Clan War Trophies: {trophies}</Text>
              <Slider max={7000} min={0} onChange={setTrophies} size="lg" step={10} value={trophies} />
            </Stack>
            <Stack gap="xs">
              <Text size="sm">Min. Clan Score: {score}</Text>
              <Slider max={70000} min={0} onChange={setScore} size="lg" step={100} value={score} />
            </Stack>
            <Stack gap="xs">
              <Text size="sm">
                Number of Members: {`${members[0]}${members[0] !== members[1] ? ` - ${members[1]}` : ""}`}
              </Text>
              <RangeSlider max={50} min={2} minRange={0} onChange={setMembers} size="lg" step={1} value={members} />
            </Stack>
          </SimpleGrid>

          <Group>
            <Button maw="fit-content" onClick={handleSubmit} size={isMobile ? "xs" : "sm"}>
              Search
            </Button>

            <Button maw="fit-content" onClick={handleReset} size={isMobile ? "xs" : "sm"} variant="default">
              Reset
            </Button>
          </Group>
        </Stack>
      </Collapse>

      <Text size="sm" ta="right">
        {resultsFound} search result(s) found.
      </Text>
    </Stack>
  )
}
