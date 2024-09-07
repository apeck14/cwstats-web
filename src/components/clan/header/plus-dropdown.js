import { Menu, Text } from "@mantine/core"
import { IconCalendarWeek, IconHourglassEmpty, IconTrophy } from "@tabler/icons-react"
import Link from "next/link"

import classes from "./header.module.css"

export default function PlusDropdown({ active, tag }) {
  return (
    <Menu arrowPosition="center" closeDelay={100} openDelay={100} position="bottom-start" trigger="hover" withArrow>
      <Menu.Target>
        <Text className={classes.plus} data-active={active}>
          Plus
        </Text>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          fw={500}
          href={`/clan/${tag}/plus/hourly-fame`}
          leftSection={<IconHourglassEmpty color="var(--mantine-color-orange-5)" size="1.25rem" />}
          px="0.5rem"
        >
          Hourly Fame Tracking
        </Menu.Item>
        <Menu.Item
          component={Link}
          fw={500}
          href={`/clan/${tag}/plus/daily-tracking`}
          leftSection={<IconCalendarWeek color="var(--mantine-color-orange-5)" size="1.25rem" />}
          px="0.5rem"
        >
          Daily Player Tracking
        </Menu.Item>
        <Menu.Item
          disabled
          fw={500}
          leftSection={<IconTrophy color="var(--mantine-color-orange-5)" size="1.25rem" />}
          px="0.5rem"
        >
          Leaderboard Stats
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
