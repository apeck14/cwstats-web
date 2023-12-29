import { Badge, Card, Group, rem, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconChartCandle, IconChartHistogram, IconCrown } from "@tabler/icons-react"

const mockdata = [
  {
    description:
      "Maximize your clan's efficiency with advanced player match insights, daily clan tracking, and other cutting-edge CW2 features.",
    icon: IconChartHistogram,
    title: "Advanced Features",
  },
  {
    description: "Reduce bot and website limitations, and unlock new functionalities, including Global Abbreviations!",
    icon: IconChartCandle,
    title: "More Functionality",
  },
  {
    description:
      "Unlock an array of additional features, providing you with even more tools and options to elevate your CW2 experience.",
    icon: IconCrown,
    title: "& much more!",
  },
]

export default function UpgradeHeader() {
  const features = mockdata.map((feature) => (
    <Card bg="gray.9" c="pink.6" key={feature.title} padding="xl" radius="md" shadow="md">
      <feature.icon stroke={2} style={{ height: rem(50), width: rem(50) }} />
      <Text c="white" fw={600} fz="lg" mt="md">
        {feature.title}
      </Text>
      <Text c="gray.1" fz="sm" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ))

  return (
    <Stack py="5rem">
      <Group justify="center">
        <Badge size="lg" variant="gradient">
          CWStats
        </Badge>
      </Group>

      <Title fw={900} fz="2.75rem" my="lg" ta="center">
        Upgrade your CW2 experience effortlessly
      </Title>

      <Text c="gray.1" mt="md" ta="center">
        For almost two years, CWStats has been a reliable companion for elite war clans, offering crucial statistics and
        projections in an ad-free environment without upfront charges. We kindly invite you to unlock the full potential
        of CWStats to show your gratitude for our dedicated efforts, and take your clan family to new heights today.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} mt={50} spacing="xl">
        {features}
      </SimpleGrid>
    </Stack>
  )
}
