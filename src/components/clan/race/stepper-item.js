import { ActionIcon, Group, Modal, Paper, Progress, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import Image from "@/components/ui/image"

import RankIcon from "../rank-icon"

export default function StepperItem({
  actionIconSize,
  clansBadgeData,
  color,
  dayIsActive,
  dayIsCompleted,
  description,
  Icon,
  iconSize,
  isColosseum,
  isTablet,
  periodLog,
  radius,
  showModal,
  tag,
  title,
}) {
  const [opened, { close, open }] = useDisclosure(false)

  const maxFame = isColosseum ? 180000 : 45000

  return (
    <>
      <Stack gap="0.25rem" key={`step-${title}`}>
        <ActionIcon
          aria-label={title}
          color={dayIsCompleted ? color : "gray.5"}
          onClick={open}
          radius={radius}
          size={actionIconSize}
          style={dayIsActive ? { border: `3px solid ${color}` } : {}}
          variant="filled"
        >
          <Icon color={dayIsCompleted ? "var(--mantine-color-white)" : "var(--mantine-color-gray-1)"} size={iconSize} />
        </ActionIcon>
        <Stack align="center" gap="0" key={`title-${title}`}>
          <Text fw="600" fz={{ base: "0.65rem", md: "sm" }}>
            {title}
          </Text>
          <Text c="gray.1" fz={{ base: "0.6rem", md: "xs" }}>
            {description}
          </Text>
        </Stack>
      </Stack>
      {showModal && (
        <Modal centered onClose={close} opened={opened} title={<Title fz="1.25rem">{title} Details</Title>}>
          <Stack gap="xl">
            {periodLog?.items?.map((l) => {
              const { badge, name } = clansBadgeData.find((c) => c.tag === l.clan.tag)
              return (
                <Group key={l.clan.tag}>
                  <RankIcon place={l.endOfDayRank + 1} />
                  <Stack flex={1} gap="0.2rem">
                    <Group gap={isTablet ? "0.4rem" : "0.75rem"} justify="space-between">
                      <Group flex={1} gap="0.2rem">
                        <Image
                          alt="Clan Badge"
                          height={isTablet ? 20 : 24}
                          src={`/assets/badges/${badge}.webp`}
                          unoptimized
                        />
                        <Text fw={700} fz={{ base: "0.8rem", md: "0.9rem" }}>
                          {name}
                        </Text>
                      </Group>
                      <Group gap="0.2rem">
                        <Text fw="600" fz={{ base: "0.7rem", md: "0.85rem" }}>
                          {l.progressStartOfDay} (+{l.progressEndOfDay - l.progressStartOfDay})
                        </Text>
                        <Image alt="Boat Points" height={16} src="/assets/icons/boat-movement.webp" />
                      </Group>
                      <Group gap="0.2rem">
                        <Text fw="600" fz={{ base: "0.7rem", md: "0.85rem" }}>
                          {l.pointsEarned}
                        </Text>
                        <Image alt="fame" height={16} src="/assets/icons/fame.webp" />
                      </Group>
                    </Group>
                    <Group>
                      <Progress.Root flex={1} w="80%">
                        <Progress.Section
                          color={tag === l.clan.tag ? "pink" : "orange.6"}
                          value={(l.pointsEarned / maxFame) * 100}
                        />
                      </Progress.Root>
                      <Paper bg="gray.8" fw="600" fz="0.7rem" miw="2.25rem" py="0.1rem" ta="center">
                        {(l.pointsEarned / 200).toFixed(1)}
                      </Paper>
                    </Group>
                  </Stack>
                </Group>
              )
            })}
          </Stack>
        </Modal>
      )}
    </>
  )
}
