import { Group, Paper, Radio, Text } from "@mantine/core"

import classes from "../plus.module.css"

export default function HourlyAvgDay({ checked, day, handleClick, season, week }) {
  const handleDayClick = () => {
    handleClick(season, week, day)
  }

  return (
    <Paper className={classes.day} onClick={handleDayClick} p="md">
      <Group gap="xs">
        <Radio checked={checked} onChange={handleDayClick} />
        <Text fw={600}>Day {day}</Text>
      </Group>
    </Paper>
  )
}
