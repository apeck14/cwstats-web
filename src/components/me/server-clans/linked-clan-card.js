import { Accordion, ActionIcon, Button, Card, Divider, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import {
  IconCheck,
  IconClipboardData,
  IconNotes,
  IconServerBolt,
  IconTrash,
  IconWorldBolt,
  IconX,
} from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

import { setDailyWarReport, setSeasonalReport } from "@/actions/discord"
import { deleteLinkedClan } from "@/actions/server"
import { sendLogWebhook } from "@/actions/upgrade"
import Image from "@/components/ui/image"
import { formatTag } from "@/lib/functions/utils"
import { embedColors } from "@/static/colors"

import { postStripeCheckout } from "../../../actions/api"
import ClanTierIcon from "../../clan-tier-icon"
import ProIcon from "../../ui/pro-icon"
import PlusFormModal from "../../upgrade/plus-form-modal"
import classes from "../me.module.css"
import ClanLogsModal from "./clan-logs-modal"
import ReportModal from "./report-modal"
import WarLogsModal from "./war-logs-modal"

function FeatureCard({ children, icon, isPlus, title }) {
  return (
    <Card
      align="center"
      bd="2px solid gray.7"
      bg="gray.8"
      className={classes[`feature-card-${isPlus ? "plus" : "pro"}`]}
      component={Stack}
      gap="md"
      h="10rem"
      justify="center"
    >
      <Group gap="0.25rem">
        {icon}
        <Text c="gray.1" fw="700">
          {title}
        </Text>
      </Group>

      {children}
    </Card>
  )
}

export default function LinkedClanCard({ channels, clan, clans, id, setClans }) {
  const [showConfirmButtons, setShowConfirmButtons] = useState(false)
  const [warReportEnabled, setWarReportEnabled] = useState(clan.warReportEnabled)
  const [seasonalReportEnabled, setSeasonalReportEnabled] = useState(clan.seasonalReportEnabled)
  const [hasWebhook, setHasWebhook] = useState(!!clan.webhookUrl)
  const router = useRouter()

  const isPlus = !!clan.isPlus
  const isPro = !!clan.isPro

  const handleConfirm = async () => {
    setClans(clans.filter((c) => c.tag !== clan.tag))
    await deleteLinkedClan(id, clan.tag)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "Linked Clan Deleted",
      },
      true,
    )
  }

  const handleSeasonReportDisable = () => {
    setSeasonalReport(clan.tag, false)
    setSeasonalReportEnabled(false)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "Seasonal Report Disabled",
      },
      true,
    )
  }

  const handleWarReportDisable = () => {
    setDailyWarReport(clan.tag, false)
    setWarReportEnabled(false)

    sendLogWebhook(
      {
        clan: clan.clanName,
        color: embedColors.red,
        guild: id,
        tag: formatTag(clan.tag, true),
        title: "War Report Disabled",
      },
      true,
    )
  }

  const handleUpgrade = async () => {
    const { url } = await postStripeCheckout(clan.tag)

    if (url) {
      window.location.assign(url)
    } else {
      router.push("/500_")
    }
  }

  return (
    <Accordion variant="separated">
      <Accordion.Item
        bd="2px solid var(--mantine-color-gray-7)"
        bg="gray.8"
        component={Card}
        p={{ base: "0.2rem", md: "xs" }}
        value={clan.tag}
      >
        <Accordion.Control>
          <Group justify="space-between">
            <Group gap="0.4rem">
              <Image alt="Clan Badge" height={28} src={`/assets/badges/${clan.clanBadge}.webp`} />
              <Text fw="600" fz="xl">
                {clan.clanName}
              </Text>
              <ClanTierIcon isPlus={isPlus} isPro={isPro} showPopover={false} size="xs" />
            </Group>
          </Group>
        </Accordion.Control>

        <Accordion.Panel>
          <Stack gap="xs">
            <Group justify="space-between">
              <Group gap="xs">
                <Title c="gray.1" size="h5">
                  PLUS
                </Title>
                <Link href="/upgrade">
                  <Image alt="CWStats Plus" height={16} src="/assets/icons/plus.webp" />
                </Link>
              </Group>
              {isPlus ? (
                <Group gap="0.25rem">
                  <Text c="green.6" fw={500}>
                    Active
                  </Text>
                  <IconCheck color="var(--mantine-color-green-6)" size="1rem" />
                </Group>
              ) : (
                <PlusFormModal clan={clan} size="xs" width="4.5rem">
                  Activate
                </PlusFormModal>
              )}
            </Group>

            {isPlus && !hasWebhook ? (
              <Stack>
                <Text c="red.6" fs="italic">
                  Missing webhook for this clan.
                </Text>

                <ReportModal
                  channels={channels}
                  clan={clan}
                  id={id}
                  isPlus={isPlus}
                  setHasWebhook={setHasWebhook}
                  type="webhook-only"
                />
              </Stack>
            ) : (
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                <FeatureCard
                  icon={<IconClipboardData color="var(--mantine-color-gray-5)" />}
                  isPlus
                  title="Seasonal Report"
                >
                  {isPlus && seasonalReportEnabled ? (
                    <Button
                      color="red"
                      disabled={!isPlus}
                      maw="fit-content"
                      onClick={handleSeasonReportDisable}
                      size="xs"
                      variant="light"
                    >
                      Disable
                    </Button>
                  ) : (
                    <ReportModal
                      channels={channels}
                      clan={clan}
                      id={id}
                      isPlus={isPlus}
                      setReportActive={setSeasonalReportEnabled}
                      type="seasonal"
                    />
                  )}
                </FeatureCard>

                <FeatureCard
                  icon={<IconClipboardData color="var(--mantine-color-gray-5)" />}
                  isPlus
                  title="Daily War Report"
                >
                  {isPlus && warReportEnabled ? (
                    <Button
                      color="red"
                      disabled={!isPlus}
                      maw="fit-content"
                      onClick={handleWarReportDisable}
                      size="xs"
                      variant="light"
                    >
                      Disable
                    </Button>
                  ) : (
                    <ReportModal
                      channels={channels}
                      clan={clan}
                      id={id}
                      isPlus={isPlus}
                      setReportActive={setWarReportEnabled}
                      type="war"
                    />
                  )}
                </FeatureCard>
              </SimpleGrid>
            )}
          </Stack>

          <Divider color="gray.7" my="lg" size="md" />

          <Stack gap="xs">
            <Group justify="space-between">
              <Group gap="xs">
                <Title c="gray.1" size="h5">
                  PRO
                </Title>
                <ProIcon size="xs" />
              </Group>
              {isPro ? (
                <Group gap="0.25rem">
                  <Text c="green.6" fw={500}>
                    Active
                  </Text>
                  <IconCheck color="var(--mantine-color-green-6)" size="1rem" />
                </Group>
              ) : (
                <Button onClick={handleUpgrade} size="xs" variant="gradient" w="4.5rem">
                  Upgrade
                </Button>
              )}
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }}>
              <FeatureCard icon={<IconServerBolt color="var(--mantine-color-gray-5)" />} title="War Logs">
                <WarLogsModal channels={channels} clan={clan} enabled={isPro} id={id} />
              </FeatureCard>
              <FeatureCard icon={<IconNotes color="var(--mantine-color-gray-5)" />} title="Clan Logs">
                <ClanLogsModal channels={channels} clan={clan} enabled={isPro} id={id} />
              </FeatureCard>
              <FeatureCard icon={<IconWorldBolt color="var(--mantine-color-gray-5)" />} title="Vanity URL">
                <Button disabled={!isPro} size="xs" variant="default" w="fit-content">
                  Coming Soon 🎉
                </Button>
              </FeatureCard>
            </SimpleGrid>
          </Stack>

          <Divider color="gray.7" my="lg" size="md" />

          {showConfirmButtons ? (
            <Group gap="xs" justify="end">
              <ActionIcon color="green" onClick={handleConfirm}>
                <IconCheck size="1.25rem" />
              </ActionIcon>
              <ActionIcon color="red" onClick={() => setShowConfirmButtons(false)}>
                <IconX size="1.25rem" />
              </ActionIcon>
            </Group>
          ) : (
            <Group justify="end">
              <ActionIcon color="red" onClick={() => setShowConfirmButtons(true)}>
                <IconTrash size="1.25rem" />
              </ActionIcon>
            </Group>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
