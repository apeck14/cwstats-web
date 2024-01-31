"use client"

import { Alert, Container, Group, Stack } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import { notFound, useSearchParams } from "next/navigation"
import { useState } from "react"

import { getRegionByKey } from "../../lib/functions/utils"
import ClanSearch from "./clan-search"
import CountryDropdown from "./country-dropdown"
import LeaderboardHeader from "./header"
import LeaderboardTable from "./leaderboard-table"
import LeagueSegmentControl from "./league-segment-control"
import SavedClansToggle from "./saved-clans-toggle"

export default function LeaderboardContent({ clans, isWarLb, lastUpdated, linkedAccount, location }) {
  const region = getRegionByKey(location)
  const searchParamsData = useSearchParams()
  const searchParams = searchParamsData.toString()

  const [search, setSearch] = useState("")
  const [showSaved, setShowSaved] = useState(false)
  const [league, setLeague] = useState(searchParams && searchParams.slice(searchParams.indexOf("=") + 1))

  if (!region) notFound()

  const showTrackingWarning = !isWarLb && !region.isAdded && region.key !== "global"

  const onLeagueChange = (val) => {
    const params = new URLSearchParams(searchParams)

    if (val === "All") params.delete("league")
    else params.set("league", val.replace(/[^0-9]/g, ""))

    window.history.pushState(null, "", `?${params.toString()}`)

    setLeague(val)
  }

  const handleSearch = (e) => {
    setSearch(e.currentTarget.value.toLowerCase())
  }

  const handleSavedToggle = () => {
    setShowSaved(!showSaved)
  }

  return (
    <>
      <LeaderboardHeader isWarLb={isWarLb} lastUpdated={lastUpdated} region={region} />
      <Container pb="md" size="lg">
        <Stack>
          <Group w="100%" wrap="nowrap">
            <CountryDropdown />

            <LeagueSegmentControl
              onChange={onLeagueChange}
              value={searchParams && searchParams.slice(searchParams.indexOf("=") + 1)}
            />

            <SavedClansToggle handleChange={handleSavedToggle} loggedIn={!!linkedAccount?.discordID} visibleFrom="md" />
          </Group>
          <Group>
            <Group w="100%">
              <ClanSearch onChange={handleSearch} reset={() => setSearch("")} value={search} />
              <SavedClansToggle
                handleChange={handleSavedToggle}
                hiddenFrom="md"
                loggedIn={!!linkedAccount?.discordID}
              />
            </Group>
          </Group>

          <LeaderboardTable
            clans={clans}
            isWarLb={isWarLb}
            league={league}
            savedClans={linkedAccount?.savedClans?.map((c) => c.tag)}
            search={search}
            showSavedClans={showSaved}
          />
          {showTrackingWarning && (
            <Alert
              color="orange"
              icon={<IconInfoCircle />}
              m="2rem auto"
              maw="45rem"
              title="Region is not being tracked."
              variant="light"
            >
              Due to Supercell limitations, priority is given to globally ranked clans and clans from major regions,
              potentially resulting in some clans missing from this region.
            </Alert>
          )}
        </Stack>
      </Container>
    </>
  )
}
