import { Container, Group, SimpleGrid, Text, Title } from "@mantine/core"
import Link from "next/link"

import { getGuilds } from "@/actions/discord"
import ServerCard from "@/components/me/server-card"
import InfoPopover from "@/components/ui/info-popover"

export const metadata = {
  description: "View my Discord servers in CWStats.",
  title: "My Servers | CWStats",
}

export default async function ServersPage() {
  const { data: guilds } = await getGuilds(true)

  return (
    <Container py="3rem" size="lg">
      <Group justify="center">
        <Title ta="center">Select a server</Title>
        <InfoPopover
          iconSize="1.5rem"
          text="You must have Administrator or Manage Server permissions to access a server's settings."
        />
      </Group>
      {!guilds.length ? (
        <Text c="dimmed" fw={500} fz="xl" mt="5rem" ta="center">
          No servers found. Click{" "}
          <Link className="text" href="/invite">
            here
          </Link>{" "}
          to invite the bot.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, lg: 3, md: 2 }} pt="lg">
          {guilds.map((g) => (
            <ServerCard icon={g.icon} id={g.id} key={g.id} name={g.name} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  )
}
