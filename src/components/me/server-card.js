"use client"

import { Button, Card, Group, Text } from "@mantine/core"
import { IconArrowNarrowRight } from "@tabler/icons-react"
import Link from "next/link"

import { truncateString } from "@/lib/functions/utils"

import DiscordServerIcon from "./discord-server-icon"

export default function ServerCard({ icon, id, name }) {
  return (
    <Card bg="gray.7" radius="md">
      <Card.Section bg="gray.10">
        <Group justify="center" py="lg">
          <DiscordServerIcon icon={icon} id={id} name={name} />
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Group justify="space-between">
          <Text fw={600} fz="1.1rem">
            {truncateString(name, 28)}
          </Text>
          <Button component={Link} href={`/me/servers/${id}`} prefetch={false} rightSection={<IconArrowNarrowRight />}>
            Go
          </Button>
        </Group>
      </Card.Section>
    </Card>
  )
}
