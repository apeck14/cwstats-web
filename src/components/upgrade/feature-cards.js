"use client"

import { Button, Card, Divider, Flex, Group, Paper, Popover, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCircleCheck } from "@tabler/icons-react"

import PlusFormModal from "./plus-form-modal"
import classes from "./upgrade.module.css"

const options = [
  {
    button: (
      <Card align="center" className={classes["striped-gray"]} component={Flex} h="2.25rem" justify="center" p={0}>
        <Text c="gray.5" fw={600}>
          Base Plan
        </Text>
      </Card>
    ),
    color: "var(--mantine-color-gray-3)",
    featureHeader: "Get started with:",
    features: [
      { text: "Full access to Discord Bot" },
      { text: "Race stats & projections" },
      { text: "Daily war leaderboards" },
      { text: "War deck spying" },
      { text: "Automated Discord application system" },
      { subText: "15 Abbreviations", text: "Clan abbreviations" },
      { subText: "3 Scheduled Nudges • 100 Linked Players", text: "Nudges via Discord" },
    ],
    price: "FREE",
    subtitle: "Perfect for casual war clans looking to enhance their war experience.",
    title: "Standard",
  },
  {
    button: <PlusFormModal />,
    color: "var(--mantine-color-orange-5)",
    featureHeader: "All STANDARD features, plus:",
    features: [
      { subText: "Daily & weekly player performance tracking.", text: "Player tracking" },
      { text: "Hourly clan average tracking" },
      { text: "Plus checkmark" },
      { text: "Guaranteed spot on Daily Leaderboard" },
      { subText: "+2 Scheduled Nudges • +75 Linked Players", text: "Increased Nudge Limits" },
    ],
    price: "FREE",
    subtitle: "For competitive war clans looking to dive into rich CW2 features.",
    title: "Plus",
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
            Upgrade from your server dashboard! 🎉
          </Text>
        </Popover.Dropdown>
      </Popover>
    ),
    color: "var(--mantine-color-pink-5)",
    featureHeader: "All PLUS features, plus:",
    features: [
      { subText: "Real-time battle logs posted in your Discord server", text: "War Logs" },
      { text: "Global clan abbreviation" },
      { text: "Special role in Support Server" },
      { text: "Pro checkmark" },
      { text: "No clan description or trophy requirement" },
      { text: "& more coming soon! 🎉" },
    ],
    price: "$2.50",
    subtitle: "Unlock the full power of CWStats with advanced features.",
    title: "Pro",
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
              <Title c={c.color} fw={600} size="h2">
                {c.title}
              </Title>
              <Group align="end" gap="0.25rem" my="xs">
                <Text c="white" fw={800} size="1.75rem">
                  {c.price}
                </Text>
                {c.price !== "FREE" && (
                  <Text c="gray.2" fw={600}>
                    /month
                  </Text>
                )}
              </Group>

              <Text c="gray.4" fz="0.9rem" mb="lg">
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
                <IconCircleCheck color={c.color} size="1.2rem" />

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
