import { Group } from "@mantine/core"

import { getShortenedDiscordServerName } from "@/lib/functions/utils"

import Image from "../ui/image"
import classes from "./me.module.css"

function Icon({ content, height }) {
  return (
    <Group className={classes.icon} h={height} w={height}>
      {content}
    </Group>
  )
}

export default function DiscordServerIcon({ height = 80, icon, id, name }) {
  return (
    <Icon
      content={
        icon ? (
          <Image
            alt="Server Icon"
            className={classes.icon}
            height={height}
            src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp`}
            unoptimized
          />
        ) : (
          getShortenedDiscordServerName(name)
        )
      }
      height={height}
    />
  )
}
