import { Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

import Image from "../ui/image"
import classes from "./Home.module.css"

export default function SavedItem({ badge, name, tag }) {
  return (
    <Group className={classes.main} p="sm" wrap="nowrap">
      <Image alt="Icon" height={40} src={`/assets/${badge ? `badges/${badge}` : "icons/king-pink"}.webp`} unoptimized />

      <Stack gap={0} w="100%">
        <Group justify="space-between" wrap="nowrap">
          <Text
            className="text"
            component={Link}
            fw={600}
            href={badge ? `/clan/${tag.substring(1)}` : `/player/${tag.substring(1)}`}
            prefetch={false}
          >
            {name}
          </Text>
          <Text>{tag}</Text>
        </Group>
        <Group justify="space-between" wrap="nowrap">
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/race` : `/player/${tag.substring(1)}/battles`}
            prefetch={false}
          >
            {badge ? "Race" : "Battles"}
          </Link>
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/log` : `/player/${tag.substring(1)}/cards`}
            prefetch={false}
          >
            {badge ? "Log" : "Cards"}
          </Link>
          <Link
            className={classes.link}
            href={badge ? `/clan/${tag.substring(1)}/plus/daily-tracking` : `/player/${tag.substring(1)}/war`}
            prefetch={false}
          >
            {badge ? "Plus" : "War"}
          </Link>
        </Group>
      </Stack>
    </Group>
  )
}
