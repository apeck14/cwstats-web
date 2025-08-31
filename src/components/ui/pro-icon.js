import { Pill, Popover, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconParkingCircleFilled } from "@tabler/icons-react"

import classes from "./ui.module.css"

export default function ProIcon({ isMobile, showPopover = false, size = "sm" }) {
  const [opened, { close, open }] = useDisclosure(false)

  const PillComponent = isMobile ? (
    <IconParkingCircleFilled color="var(--mantine-color-pink-6)" size="1rem" />
  ) : (
    <Pill className={classes.proIcon} radius="md" size={size} w="fit-content">
      PRO
    </Pill>
  )

  if (showPopover) {
    return (
      <Popover className="cursorPointer" opened={opened} position="top" shadow="md" width={200} withArrow>
        <Popover.Target onMouseEnter={open} onMouseLeave={close}>
          {PillComponent}
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }} w="fit-content">
          <Text fw="600" fz="0.8rem" size="xs">
            CWStats PRO
          </Text>
        </Popover.Dropdown>
      </Popover>
    )
  }

  return PillComponent
}
