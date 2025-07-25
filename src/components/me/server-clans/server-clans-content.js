"use client"

import { ActionIcon, Card, Container, Divider, Group, Input, Paper, Stack, Text, Title } from "@mantine/core"
import { IconBrandDiscordFilled, IconCheck, IconSlash, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import { setDiscordInvite, setFreeWarLogClan } from "@/actions/server"
import InfoPopover from "@/components/ui/info-popover"
import colors from "@/static/colors"

import LinkClanModal from "./link-clan-modal"
import LinkedClanCard from "./linked-clan-card"
import WarLogsModal from "./war-logs-modal"

export default function ServerClansContent({ channels, discordInviteCode, freeWarLogClan, id, linkedClans }) {
  const [clans, setClans] = useState(linkedClans)
  const [inviteError, setInviteError] = useState("")
  const [tempDiscordInv, setTempDiscordInv] = useState(discordInviteCode || "")
  const [discordInv, setDiscordInv] = useState(discordInviteCode || "")
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)
  const [warLogClan, setWarLogClan] = useState(freeWarLogClan?.webhookUrl1 && freeWarLogClan) // ensure it has more than just timestamp

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

  const handleWarLogsClanDelete = async () => {
    setFreeWarLogClan({ channelId: null, guildId: id, tag: warLogClan.tag })
    setWarLogClan(null)
  }

  const warLogClanName = linkedClans.find((c) => c.tag === warLogClan?.tag)?.clanName || "Unknown Clan"

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

                <Stack gap="xs">
                  <Group gap="0.25rem">
                    <Text c="gray.1" fw="500">
                      War Logs
                    </Text>
                    <InfoPopover text="Each server can enable war logs for 1 clan. Clan can only be changed every 7 days." />
                  </Group>

                  {warLogClan ? (
                    <Paper bg="gray.8" component={Group} p="xs" radius="md" w="fit-content">
                      <Text fw={600} size="sm">
                        {warLogClanName}
                      </Text>
                      <ActionIcon
                        aria-label="Settings"
                        color="orange"
                        onClick={handleWarLogsClanDelete}
                        size="sm"
                        variant="filled"
                      >
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    </Paper>
                  ) : (
                    <WarLogsModal channels={channels} id={id} linkedClans={linkedClans} setWarLogClan={setWarLogClan} />
                  )}
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
