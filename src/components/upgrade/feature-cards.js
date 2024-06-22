"use client"

import { Button, Divider, Group, Paper, Popover, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCheck } from "@tabler/icons-react"

import PlusFormModal from "./plus-form-modal"

const options = [
  {
    featureHeader: "Get started with:",
    features: [
      { text: "Full access to Discord Bot" },
      { text: "Race stats & projections" },
      { text: "Daily war leaderboards" },
      { text: "War deck spying" },
      { text: "Automated Discord application system" },
      { subText: "15 Abbreviations", text: "Clan abbreviations" },
      { subText: "5 Scheduled Nudges • 300 Linked Users", text: "Nudges via Discord" },
    ],
    subtitle: "Perfect for casual war clans.",
    title: "STANDARD",
  },
  {
    button: <PlusFormModal />,
    featureHeader: "All Standard features, plus:",
    features: [
      { text: "Hourly clan average tracking" },
      { text: "Daily player score tracking" },
      { text: "Special clan badge on website" },
      { text: "Daily Leaderboard clan accolades" },
      { text: "Guaranteed spot on Daily Leaderboard" },
    ],
    subtitle: "For competitive war clans looking to dive into rich CW2 features.",
    title: "PLUS",
  },
  {
    button: (
      <Popover position="top" shadow="md" width={200} withArrow>
        <Popover.Target>
          <Button
            className="buttonHover"
            gradient={{ deg: 180, from: "pink.7", to: "pink.5" }}
            variant="gradient"
            w="100%"
          >
            Get Started
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm" ta="center">
            Pro coming soon! 🎉
          </Text>
        </Popover.Dropdown>
      </Popover>
    ),
    featureHeader: "All Plus features, plus:",
    features: [{ text: "Deep analytics coming soon 🎉" }],
    subtitle: "Coming soon 🎉",
    title: "PRO",
  },
]

export default function FeatureCards() {
  const isLaptop = useMediaQuery("(max-width: 64em)")

  return (
    <SimpleGrid cols={{ base: 1, lg: 3 }} mb="5rem" mt="xl" spacing="xl">
      {options.map((c) => (
        <Paper bd="1px solid gray.6" bg="transparent" key={c.title} maw="25rem" mih="30rem" p="xl" radius="md">
          <Stack justify="space-between" mih={isLaptop ? 0 : "10rem"}>
            <Stack gap={0}>
              <Title fw={600} mb="sm" size="h2">
                {c.title}
              </Title>
              <Text c="gray.1" fw={600} fz="0.95rem" lh="xs" mb="lg">
                {c.subtitle}
              </Text>
            </Stack>
            {c.button}
          </Stack>

          <Divider my="lg" />

          <Text c="gray.3" fw={600} fz="0.9rem" lh="xs" mb="lg">
            {c.featureHeader}
          </Text>

          <Stack gap="xs">
            {c.features.map((f) => (
              <Group align="flex-start" gap="xs" key={f.text} wrap="nowrap">
                <IconCheck color="var(--mantine-color-green-5)" size="1.2rem" />

                <Stack gap="0">
                  <Text fw={500} fz="0.9rem">
                    {f.text}
                  </Text>
                  {f.subText && (
                    <Text c="gray.2" fw={500} fz="0.8rem">
                      {f.subText}
                    </Text>
                  )}
                </Stack>
              </Group>
            ))}
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  )
}
