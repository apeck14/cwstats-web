import { Button, Container, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { IconBrandPatreon, IconBrandPaypal, IconCup, IconHeartHandshake } from "@tabler/icons-react"
import Link from "next/link"

export const metadata = {
  description:
    "CWStats strives to aid all competitive war clans with game-changing data & stats! All proceeds help expand the capabilities of the bot & website.",
  title: "Donate | CWStats",
}

const buttons = [
  { color: "blue", icon: IconBrandPaypal, label: "PayPal", url: "https://paypal.me/cw2stats" },
  { color: "yellow", icon: IconCup, label: "Buy Me a Coffee", url: "https://buymeacoffee.com/cwstats" },
  { color: "red", icon: IconBrandPatreon, label: "Patreon", url: "https://www.patreon.com/CWStats" },
]

export default function DonatePage() {
  return (
    <Container size="lg">
      <Stack align="center" mt="10%" pb="xl">
        <ThemeIcon size="xl" variant="gradient">
          <IconHeartHandshake />
        </ThemeIcon>
        <Title fz={{ base: "2rem", md: "3rem" }} my="0.5rem">
          Support CWStats
        </Title>
        <Text c="gray.2" fz={{ base: "0.9rem", md: "1.1rem" }} ta="center">
          Our services are privately funded, which means no pesky ads or upfront charges for you. However, to keep
          providing you with the latest insights and innovations, we need your support. Your donations will directly
          contribute to the maintenance and improvement of our platform, ensuring that we can continue offering you
          invaluable resources to dominate in CW2. Every contribution, no matter the size, makes a significant
          difference. Join us in shaping the future of Clan Wars strategy and analytics. Your generosity keeps us going
          strong. Thank you for being an essential part of our journey.
        </Text>

        <Group justify="space-evenly" mt="3rem">
          {buttons.map((b) => (
            <Button
              bg={b.color}
              className="buttonHover"
              component={Link}
              href={b.url}
              key={b.label}
              leftSection={<b.icon size="1.5rem" />}
              size="md"
              target="_blank"
            >
              {b.label}
            </Button>
          ))}
        </Group>
      </Stack>
    </Container>
  )
}
