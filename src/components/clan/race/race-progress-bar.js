"use client"

import { Progress } from "@mantine/core"
import { useEffect, useState } from "react"

import classes from "../clan.module.css"

export default function RaceProgressBar({ famePerc, isMobile, projPerc }) {
  const [perc, setPerc] = useState({ famePerc: 0, projPerc: 0 })

  useEffect(() => setPerc({ famePerc, projPerc }), [])

  return (
    <Progress.Root className={classes.topItem} size={isMobile ? "lg" : "xl"} transitionDuration={1000}>
      <Progress.Section color="pink" value={perc.famePerc} />
      <Progress.Section color="orange.4" value={perc.projPerc} />
    </Progress.Root>
  )
}
