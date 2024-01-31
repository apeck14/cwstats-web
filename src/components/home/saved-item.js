import { Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

import Image from "../ui/image"
import classes from "./Home.module.css"

export default function SavedItem({ badge, name, tag }) {
  return (
    <Group className={classes.main} p="sm">
      <Group>
        <Image
          alt="Icon"
          height={40}
          src={`/assets/${badge ? `badges/${badge}` : "icons/king-pink"}.webp`}
          unoptimized
          width={40}
        />
      </Group>

      <Stack gap={0}>
        <Group justify="space-between">
          <Link className={classes.name} href={badge ? `/clan/${tag.substring(1)}` : `/player/${tag.substring(1)}`}>
            {name}
          </Link>
          <Text>{tag}</Text>
        </Group>
        <Group justify="space-between">
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/race` : `/player/${tag.substring(1)}/battles`}
          >
            {badge ? "Race" : "Battles"}
          </Link>
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/log` : `/player/${tag.substring(1)}/cards`}
          >
            {badge ? "Log" : "Cards"}
          </Link>
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/stats` : `/player/${tag.substring(1)}/war`}
          >
            {badge ? "Stats" : "War"}
          </Link>
        </Group>
      </Stack>
    </Group>
  )
}
