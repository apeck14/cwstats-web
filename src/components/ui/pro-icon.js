import { Pill } from "@mantine/core"

import classes from "./ui.module.css"

export default function ProIcon({ size = "sm" }) {
  return (
    <Pill className={classes.proIcon} radius="md" size={size} w="fit-content">
      PRO
    </Pill>
  )
}
