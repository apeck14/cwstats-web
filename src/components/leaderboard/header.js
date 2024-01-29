"use client"

import { Container, Flex, Group, SegmentedControl, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"

import { relativeDateStr } from "../../lib/functions/date-time"
import { truncateString } from "../../lib/functions/utils"
import Image from "../ui/image"

export default function LeaderboardHeader({ lastUpdated, region }) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 30em)")

  const isDaily = pathname.includes("daily")

  const formattedKey = region.key.toLowerCase()

  const handleSegmentChange = (val) => {
    router.push(`/leaderboard/${val.toLowerCase()}/${formattedKey}`)
  }

  return (
    <Group className="header">
      <Container py="xl" size="lg" w="100%">
        <Group justify="space-between">
          <Group wrap="nowrap">
            <Image height={isMobile ? 40 : 60} priority src={`/assets/flag-icons/${formattedKey}.webp`} />
            <Title
              fz={{ base: "1.75rem", md: "2.75rem" }}
            >{`${truncateString(region.name, 25)} ${isDaily ? "Daily" : "War"} Rankings`}</Title>
          </Group>
          <Flex
            align={{ base: "center", md: "flex-end" }}
            direction={{ base: "row-reverse", md: "column" }}
            justify="space-between"
            rowGap="xs"
            w={{ base: "100%", md: "fit-content" }}
          >
            <Group c="dimmed" fw={600} fz={{ base: "sm", md: "md" }} gap="0.2rem">
              Last Updated:
              <Text c="pink" fw={600}>
                {relativeDateStr(lastUpdated, false)} ago
              </Text>
            </Group>
            <SegmentedControl
              color="pink"
              data={["Daily", "War"]}
              onChange={handleSegmentChange}
              size={isMobile ? "xs" : "sm"}
              value={isDaily ? "Daily" : "War"}
              w={isMobile ? "8rem" : "10rem"}
              withItemsBorders={false}
            />
          </Flex>
        </Group>
      </Container>
    </Group>
  )
}
