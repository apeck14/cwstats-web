"use client"

import { Group, SegmentedControl, Select, Stack, Switch, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCalendarWeek } from "@tabler/icons-react"
import { useState } from "react"

import DailyTrackingStats from "./daily-tracking-stats"
import DailyTrackingTable from "./daily-tracking-table"
import OverviewTable from "./overview-table"

export default function DailyTrackingContent({ data, memberTags, weekLabels }) {
  const [showOverview, setShowOverview] = useState(true)
  const [filter, setFilter] = useState(false)
  const [week, setWeek] = useState(weekLabels[0])
  const isMobile = useMediaQuery("(max-width: 30em)")

  const handleSelect = (val) => {
    setWeek(val)
  }

  return (
    <>
      <Group gap="xs" justify="center">
        <IconCalendarWeek color="var(--mantine-color-orange-5)" size={isMobile ? "1.5rem" : "2rem"} />
        <Title size={isMobile ? "h2" : "h1"}>Daily Player Tracking</Title>
      </Group>
      {!Object.keys(data).length ? (
        <Text c="gray.3" fw="600" mt="xl" ta="center">
          No data to display yet. Check back soon!
        </Text>
      ) : (
        <Stack>
          <Group justify="space-between" mt="md">
            <SegmentedControl
              color="pink"
              data={["Overview", "Weekly"]}
              onChange={() => setShowOverview(!showOverview)}
              radius="sm"
              size={isMobile ? "xs" : "sm"}
              value={showOverview ? "Overview" : "Weekly"}
            />

            {showOverview ? (
              <Switch
                c="dimmed"
                checked={filter}
                label="Filter by players in-clan"
                labelPosition="left"
                onChange={() => setFilter(!filter)}
                size={isMobile ? "sm" : "md"}
              />
            ) : (
              <Select
                allowDeselect={false}
                data={weekLabels}
                maw="9rem"
                onChange={handleSelect}
                placeholder="Pick value"
                value={week}
              />
            )}
          </Group>

          {showOverview ? (
            <OverviewTable data={data} filterByInClan={filter} labels={weekLabels} memberTags={memberTags} />
          ) : (
            <>
              <DailyTrackingStats data={data} week={week} />
              <DailyTrackingTable data={data} week={week} />
              <Text c="dimmed" fs="italic" fz="sm">
                * Striped cells indicate missed attacks
              </Text>
            </>
          )}
        </Stack>
      )}
    </>
  )
}
