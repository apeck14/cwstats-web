"use client"

import { ActionIcon, Card, Container, Divider, Group, Input, Stack, Text, Title } from "@mantine/core"
import { IconBrandDiscordFilled, IconCheck, IconSlash } from "@tabler/icons-react"
import { useState } from "react"

import { setDiscordInvite } from "@/actions/server"
import InfoPopover from "@/components/ui/info-popover"
import colors from "@/static/colors"

import LinkClanModal from "./link-clan-modal"
import LinkedClanCard from "./linked-clan-card"

export default function ServerClansContent({ channels, discordInviteCode, id, linkedClans }) {
  const [clans, setClans] = useState(linkedClans)
  const [inviteError, setInviteError] = useState("")
  const [tempDiscordInv, setTempDiscordInv] = useState(discordInviteCode || "")
  const [discordInv, setDiscordInv] = useState(discordInviteCode || "")
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)

  const handleInviteChange = (e) => {
    const val = e.currentTarget.value

    setInviteError("")

    const formattedVal = val.replace(/[^a-zA-Z0-9.]/g, "")

    setTempDiscordInv(formattedVal)

    if (formattedVal !== discordInv) setShowConfirmButtons(true)
    else setShowConfirmButtons(false)
  }

  const handleConfirm = async () => {
    if (tempDiscordInv.includes(".gg") || tempDiscordInv.includes(".com")) {
      setInviteError("Code cannot contain .com or .gg.")
    } else if ((tempDiscordInv.length < 5 && tempDiscordInv.length !== 0) || tempDiscordInv.length > 15) {
      setInviteError("Invalid code.")
    } else {
      const { error } = await setDiscordInvite(id, tempDiscordInv)

      if (error) setInviteError(error)
      else {
        setInviteError("")
        setShowConfirmButtons(false)
        setDiscordInv(tempDiscordInv)
      }
    }
  }

  return (
    <Container py="xl" size="lg">
      <Stack>
        <Group justify="space-between">
          <Group>
            <Title size="h3">Linked Clans</Title>
            <InfoPopover text="Link clans to your server to claim ownership and manage features. A clan can only be linked to one server at a time." />
          </Group>
          <LinkClanModal clans={clans} id={id} setClans={setClans} />
        </Group>

        {clans?.length ? (
          <Stack>
            <Group align="flex-end" justify="space-between" mt="md">
              <Group gap="xl">
                <Stack gap="xs">
                  <Group c={colors.discord} gap="xs">
                    <IconBrandDiscordFilled size={20} />
                    <Text c="gray.1" fw="500">
                      Server Invite Code
                    </Text>
                  </Group>

                  <Group>
                    <Stack>
                      <Group>
                        <Input
                          error={inviteError}
                          leftSection={<IconSlash size={16} />}
                          maw="10rem"
                          onChange={handleInviteChange}
                          placeholder="rx4fosQd"
                          value={tempDiscordInv}
                        />

                        {showConfirmButtons && !inviteError && (
                          <ActionIcon color="green" onClick={handleConfirm}>
                            <IconCheck size="1.25rem" />
                          </ActionIcon>
                        )}
                      </Group>

                      {inviteError && (
                        <Text c="red.6" fz="0.75rem">
                          {inviteError}
                        </Text>
                      )}
                    </Stack>
                  </Group>
                </Stack>
              </Group>

              <Text c="gray.2" fw="500" size="sm">
                {clans?.length} / 20 clans
              </Text>
            </Group>

            <Divider color="gray.7" my="md" size="md" />

            {clans.map((c) => (
              <LinkedClanCard
                channels={channels}
                clan={c}
                clans={clans}
                id={id}
                isPlus={c.plus}
                key={c.tag}
                setClans={setClans}
              />
            ))}
          </Stack>
        ) : (
          <Card bd="2px dashed gray" bg="transparent" h="20rem">
            <Group align="center" h="100%" justify="center">
              <Text c="gray.2" fw="500">
                No clans linked!
              </Text>
            </Group>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
