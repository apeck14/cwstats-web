"use client"

import { Divider, Group } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import {
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
  IconCircleNumber4Filled,
  IconCircleNumber5Filled,
  IconSwords,
  IconTargetArrow,
} from "@tabler/icons-react"
import { Fragment } from "react"

import StepperItem from "./stepper-item"

const DAYS = [
  {
    color: "var(--mantine-color-orange-6)",
    Icon: IconTargetArrow,
    subTitle: "Day 1-3",
    title: "Training",
  },
  {
    color: "var(--mantine-color-pink-6)",
    Icon: IconSwords,
    title: "Day 1",
  },
  {
    color: "var(--mantine-color-pink-6)",
    Icon: IconSwords,
    title: "Day 2",
  },
  {
    color: "var(--mantine-color-pink-6)",
    Icon: IconSwords,
    title: "Day 3",
  },
  {
    color: "var(--mantine-color-pink-6)",
    Icon: IconSwords,
    title: "Day 4",
  },
]

const completedDayIcons = [
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
  IconCircleNumber4Filled,
  IconCircleNumber5Filled,
]

export default function RaceStepper({ clansBadgeData, dayDescriptions, dayOfWeek, isColosseum, periodLogs, tag }) {
  const isTablet = useMediaQuery("(max-width: 48em)")

  const dayIndex = dayOfWeek < 3 ? 0 : dayOfWeek - 2

  const actionIconSize = isTablet ? 36 : 56 // using px to easily make calculation

  return (
    <Group align="flex-start" gap={isTablet ? "0.75rem" : "1rem"} m="0 auto" w="90%" wrap="nowrap">
      {DAYS.map((d, i) => {
        const { color, Icon, subTitle, title } = d
        const isTraining = title === "Training"

        const dayIsCompleted = dayIndex > i

        const showPlacementIcon = !isTraining && dayIsCompleted && !isColosseum

        const periodLog = showPlacementIcon && periodLogs[i - 1]
        const placementIconIndex = showPlacementIcon && periodLog.items.find((i) => i.clan.tag === tag).endOfDayRank

        const StepIcon = showPlacementIcon ? completedDayIcons[placementIconIndex] : Icon

        const STEP = (
          <StepperItem
            actionIconSize={actionIconSize}
            clansBadgeData={clansBadgeData}
            color={color}
            dayIsActive={dayIndex === i}
            dayIsCompleted={dayIsCompleted}
            description={i === 0 ? subTitle : dayDescriptions[i - 1]}
            Icon={StepIcon}
            iconSize={isTablet ? "1.25rem" : "2rem"}
            isTablet={isTablet}
            periodLog={periodLog}
            radius={isTablet ? "md" : "lg"}
            showModal={showPlacementIcon}
            tag={tag}
            title={title}
          />
        )

        // if last day, no divider
        if (i === DAYS.length - 1) return STEP
        return (
          <Fragment key={`divider-${title}`}>
            {STEP}
            <Divider color={dayIsCompleted ? color : "gray.3"} mt={actionIconSize / 2} size="sm" w="12rem" />
          </Fragment>
        )
      })}
    </Group>
  )
}
