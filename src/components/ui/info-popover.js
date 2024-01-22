"use client"

import { Popover, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconInfoCircle } from "@tabler/icons-react"

export default function InfoPopover({ color, fontSize, iconSize, text, ...props }) {
  const [opened, { close, open }] = useDisclosure(false)

  return (
    <Popover opened={opened} position="bottom" shadow="md" width={200} withArrow {...props}>
      <Popover.Target>
        <IconInfoCircle
          color={color || "var(--mantine-color-pink-6)"}
          onMouseEnter={open}
          onMouseLeave={close}
          size={iconSize || "1rem"}
        />
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Text fz={fontSize || "0.75rem"} size="xs">
          {text}
        </Text>
      </Popover.Dropdown>
    </Popover>
  )
}
