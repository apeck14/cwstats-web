import { Container, Group, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"

import classes from "./header.module.css"

export default function ClanHeader({ clan }) {
  return (
    <Stack>
      <Stack className={classes.header}>
        <Container size="lg" w="100%">
          <Stack h="10rem">
            <Group>
              <Title>{clan.name}</Title>
            </Group>
            <Group>
              <Text>{clan.tag}</Text>
            </Group>
          </Stack>
        </Container>
      </Stack>
      <Group bg="gray.10" mt="-1rem">
        <Container size="lg" w="100%">
          <Group gap="xs" py="0.5rem">
            <Link className={classes.link} href="/">
              Home
            </Link>
            <Link className={classes.link} href="/">
              Race
            </Link>
            <Link className={classes.link} href="/">
              Log
            </Link>
            <Link className={classes.link} href="/">
              CWStats+
            </Link>
          </Group>
        </Container>
      </Group>
    </Stack>
  )
}
