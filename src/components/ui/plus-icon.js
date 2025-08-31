"use client"

import { Group, Popover, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import Image from "./image"

export default function PlusIcon({ height = 16, isPlus, showNonPlusIcon = true, showPopover = true }) {
  const [opened, { close, open }] = useDisclosure(false)

  if (!showNonPlusIcon && !isPlus) return null

  const ImageComponent = (
    <Group>
      <Image alt="CWStats Plus" height={height} src={`/assets/icons/${isPlus ? "" : "not-"}plus.webp`} width={height} />
    </Group>
  )

  if (showPopover) {
    return (
      <Popover className="cursorPointer" opened={opened} position="top" shadow="md" width={200} withArrow>
        <Popover.Target onMouseEnter={open} onMouseLeave={close}>
          {ImageComponent}
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }} w="fit-content">
          <Text fw="600" fz="0.8rem" size="xs">
            {isPlus ? "CWStats+" : "CWStats+ not activated"}
          </Text>
        </Popover.Dropdown>
      </Popover>
    )
  }

  return ImageComponent
}
