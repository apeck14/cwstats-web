import { Stack } from "@mantine/core"

import DiscordBotAd from "@/components/home/discord-bot-ad"
import QuickSearch from "@/components/home/quick-search"
import RisersAndFallers from "@/components/home/risers-and-fallers"
import StarryBackground from "@/components/home/starryBackground"

// * Leave metadata as default

export default async function Page() {
  return (
    <Stack>
      <StarryBackground />
      <QuickSearch />
      <DiscordBotAd />
      <RisersAndFallers />
    </Stack>
  )
}
