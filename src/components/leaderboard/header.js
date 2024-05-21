"use client"

import { Container, Flex, Group, SegmentedControl, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useRouter } from "next-nprogress-bar"
import { useEffect, useMemo, useState } from "react"

import { relativeDateStr } from "@/lib/functions/date-time"
import { truncateString } from "@/lib/functions/utils"

import Image from "../ui/image"

export default function LeaderboardHeader({ isWarLb, lastUpdated, region }) {
  const [dateStr, setDateStr] = useState(null)

  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 30em)")

  const formattedKey = region.key.toLowerCase()

  const handleSegmentChange = (val) => {
    router.push(`/leaderboard/${val.toLowerCase()}/${formattedKey}`)
  }

  useEffect(() => {
    setDateStr(relativeDateStr(new Date(lastUpdated), false))
  }, [])

  const truncatedRegion = useMemo(() => truncateString(region.name, 25), [region])

  return (
    <Group className="header">
      <Container py="xl" size="lg" w="100%">
        <Group justify="space-between">
          <Group wrap="nowrap">
            <Image alt="Flag" height={isMobile ? 40 : 60} priority src={`/assets/flag-icons/${formattedKey}.webp`} />
            <Title
              fz={{ base: "1.75rem", md: "2.75rem" }}
            >{`${truncatedRegion} ${isWarLb ? "War" : "Daily"} Rankings`}</Title>
          </Group>
          <Flex
            align={{ base: "center", md: "flex-end" }}
            direction={{ base: "row", md: "column" }}
            justify="space-between"
            rowGap="xs"
            w={{ base: "100%", md: "fit-content" }}
          >
            <SegmentedControl
              color="pink"
              data={["Daily", "War"]}
              onChange={handleSegmentChange}
              size={isMobile ? "xs" : "sm"}
              value={isWarLb ? "War" : "Daily"}
              w={isMobile ? "8rem" : "10rem"}
              withItemsBorders={false}
            />
            {!isWarLb && (
              <Group c="dimmed" fw={600} fz={{ base: "xs", md: "sm" }} gap="0.2rem">
                Last Updated:
                <Text c="pink" fw={600} fz={{ base: "xs", md: "sm" }}>
                  {dateStr} ago
                </Text>
              </Group>
            )}
          </Flex>
        </Group>
      </Container>
    </Group>
  )
}
