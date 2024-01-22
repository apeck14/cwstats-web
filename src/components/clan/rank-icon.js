"use client"

import { Group } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

import Image from "../ui/image"
import classes from "./clan.module.css"

const getBackgroundColor = (rank) => {
  if (rank === 1) return "var(--mantine-color-yellow-7)"
  if (rank === 2) return "var(--mantine-color-dark-2)"
  if (rank === 3) return "#81372e"

  return "var(--mantine-color-dark-7)"
}

const getBorderColor = (rank) => {
  if (rank === 1) return "var(--mantine-color-yellow-5)"
  if (rank === 2) return "var(--mantine-color-dark-1)"
  if (rank === 3) return "#b97852"

  return "var(--mantine-color-dark-2)"
}

export default function RankIcon({ isFinished, place }) {
  const isMobile = useMediaQuery("(max-width: 30em)")
  const containerSize = `${isMobile ? 1.25 : 1.5}rem`
  const fontSize = `${isMobile ? 0.9 : 1}rem`
  const size = isMobile ? 20 : 24

  if (isFinished) return <Image height={size} src="/assets/icons/flag.png" />
  if (!place) return null

  return (
    <Group
      bg={getBackgroundColor(place)}
      className={classes.rankIcon}
      fw={600}
      fz={fontSize}
      h={containerSize}
      justify="center"
      style={{ outline: `2px solid ${getBorderColor(place)}` }}
      w={containerSize}
    >
      {place}
    </Group>
  )
}
