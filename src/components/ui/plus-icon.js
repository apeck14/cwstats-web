"use client"

import { Group, Popover, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"

import Image from "./image"

export default function PlusIcon({ isPlus, showPopover = true, size = 16, tag }) {
  const [opened, { close, open }] = useDisclosure(false)

  const ImageComponent = (
    <Group component={Link} href={isPlus ? `/clan/${tag}/plus/daily-tracking` : "/upgrade"} prefetch={false}>
      <Image alt="CWStats Plus" height={size} src={`/assets/icons/${isPlus ? "" : "not-"}plus.webp`} width={size} />
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
