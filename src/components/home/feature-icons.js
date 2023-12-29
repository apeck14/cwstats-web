import { Flex, Text, ThemeIcon, Title } from "@mantine/core"
import { IconBrandDiscord, IconClockBolt, IconTools } from "@tabler/icons-react"

import { breakpointObj } from "../../lib/functions"

export default function FeatureIcons({ breakpoint }) {
  const direction = breakpointObj("row", "row", "column")[breakpoint]
  const titleSize = breakpointObj(1.2, 1.2, 1.5)[breakpoint]

  return (
    <Flex direction={breakpointObj("column", "column", "row")[breakpoint]} gap="xl" pt="xl">
      <Flex direction={direction} gap="sm" key="s1">
        <ThemeIcon size="xl" variant="gradient">
          <IconBrandDiscord />
        </ThemeIcon>
        <Flex direction="column">
          <Title fz={`${titleSize}rem`}>Discord Bot</Title>
          <Text c="gray.1" fw={500}>
            Bring the analytics you love directly to your Discord servers
          </Text>
        </Flex>
      </Flex>
      <Flex direction={direction} gap="sm" key="s2">
        <ThemeIcon size="xl" variant="gradient">
          <IconClockBolt />
        </ThemeIcon>
        <Flex direction="column">
          <Title fz={`${titleSize}rem`}>Real-Time Data</Title>
          <Text c="gray.1" fw={500}>
            Foster quick, informed decisions to maximize your clan&apos;s success
          </Text>
        </Flex>
      </Flex>
      <Flex direction={direction} gap="sm" key="s3">
        <ThemeIcon size="xl" variant="gradient">
          <IconTools />
        </ThemeIcon>
        <Flex direction="column">
          <Title fz={`${titleSize}rem`}>CW2 Tools</Title>
          <Text c="gray.1" fw={500}>
            Explore cutting-edge tools to always give you and your clan the advantage
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
