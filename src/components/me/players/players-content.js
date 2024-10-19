"use client"

import { Container, Stack } from "@mantine/core"
import { useState } from "react"

import { calcLinkedPlayerLimit } from "@/lib/functions/utils"

import LinkedAccounts from "./linked-accounts"
import PlayerActions from "./player-actions"

export default function PlayersContent({ guild, linkedClansCount }) {
  const [linkedAccounts, setLinkedAccounts] = useState(guild?.nudges?.links || [])

  const linkedPlayerLimit = calcLinkedPlayerLimit(linkedClansCount)

  return (
    <Container py="xl" size="lg">
      <Stack gap="3rem">
        <PlayerActions
          guildID={guild.guildID}
          limit={linkedPlayerLimit}
          linkedAccounts={linkedAccounts}
          setLinkedAccounts={setLinkedAccounts}
        />
        <LinkedAccounts
          guildID={guild.guildID}
          limit={linkedPlayerLimit}
          linkedAccounts={linkedAccounts}
          setLinkedAccounts={setLinkedAccounts}
        />
      </Stack>
    </Container>
  )
}
