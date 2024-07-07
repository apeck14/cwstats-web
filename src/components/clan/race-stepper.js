"use client"

import { Stepper } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconSwords, IconTargetArrow } from "@tabler/icons-react"

export default function RaceStepper({ dayDescriptions, dayOfWeek }) {
  const isTablet = useMediaQuery("(max-width: 48em)")

  const index = dayOfWeek < 3 ? (isTablet ? -1 : 0) : isTablet ? dayOfWeek - 3 : dayOfWeek - 2
  const iconSize = isTablet ? "0.75rem" : "1.25rem"

  return (
    <Stepper active={index} iconSize={isTablet ? 20 : 32} radius="md" size={isTablet ? "0.65rem" : "sm"} wrap={false}>
      {!isTablet && (
        <Stepper.Step
          color="var(--mantine-color-orange-5)"
          completedIcon={<IconTargetArrow size={iconSize} />}
          description="Day 1-3"
          icon={<IconTargetArrow size={iconSize} />}
          label="Training"
        />
      )}
      <Stepper.Step
        completedIcon={<IconSwords size={iconSize} />}
        description={isTablet ? dayDescriptions.mobile[0] : dayDescriptions.standard[0]}
        icon={<IconSwords size={iconSize} />}
        label="Day 1"
      />
      <Stepper.Step
        completedIcon={<IconSwords size={iconSize} />}
        description={isTablet ? dayDescriptions.mobile[1] : dayDescriptions.standard[1]}
        icon={<IconSwords size={iconSize} />}
        label="Day 2"
      />
      <Stepper.Step
        completedIcon={<IconSwords size={iconSize} />}
        description={isTablet ? dayDescriptions.mobile[2] : dayDescriptions.standard[2]}
        icon={<IconSwords size={iconSize} />}
        label="Day 3"
      />
      <Stepper.Step
        completedIcon={<IconSwords size={iconSize} />}
        icon={<IconSwords size={iconSize} />}
        label="Day 4"
      />
    </Stepper>
  )
}
