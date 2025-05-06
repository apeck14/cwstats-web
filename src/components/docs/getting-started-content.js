"use client"

import { Blockquote, Divider, Group, List, Stack, Text, Title } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"
import Link from "next/link"

import Image from "@/components/ui/image"
import colors from "@/static/colors"

export default function GettingStartedContent() {
  return (
    <Stack gap="3rem">
      <Stack>
        <Group justify="space-between">
          <Title>Getting Started</Title>
          <Image alt="CWStats" height={48} src="/assets/icons/logo.webp" />
        </Group>
        <Divider color="gray.7" size="md" />
      </Stack>

      <Stack>
        <Title fw="600" size="h2">
          The Basics
        </Title>
        <Text c="gray.1">
          CWStats offers two free, ready-to-use services: a Discord Bot and this website, both requiring no initial
          setup. However, to maximize the benefits of these tools, you can quickly configure a few optional features:
        </Text>
        <List withPadding>
          <List.Item>Creating abbreviations</List.Item>
          <List.Item>Setting a default clan</List.Item>
          <List.Item>Linking your player profile</List.Item>
        </List>
      </Stack>

      <Blockquote color={colors.discord} icon={<IconInfoCircle />}>
        <Title size="h4">Managing Your Server</Title>
        All server configuration requires you to{" "}
        <Text
          c="var(--mantine-color-pink-6)"
          className="text"
          component={Link}
          href="/login?callback=/me/servers"
          target="_blank"
        >
          log in
        </Text>{" "}
        with Discord, and navigate to your desired server. Only users with <b>Manage Server+</b> permissions will be
        able to manage your server&apos;s settings.
      </Blockquote>

      <Divider color="gray.7" size="sm" />

      <Stack align="flex-start">
        <Title fw="600" size="h2">
          Creating Abbreviations
        </Title>
        <Text c="gray.1">
          Abbreviations are custom short phrases that you can create to use in clan commands, instead of typing out the
          full clan tag. Each phrase is linked to a specific clan, helping you save time when executing commands.
        </Text>

        <Image alt="Add Abbreviation Example" height="300" src="/assets/docs/add-abbreviation.webp" unoptimized />
      </Stack>

      <Divider color="gray.7" size="sm" />

      <Stack align="flex-start">
        <Title fw="600" size="h2">
          Setting a Default Clan
        </Title>
        <Text c="gray.1">
          Setting a default clan for your Discord server streamlines your experience, saving both time and effort.
          Instead of repeatedly entering the clan&apos;s abbreviation or full tag for each command, you can run any
          clan-related command without additional input, and it will automatically apply to your set default clan.{" "}
          <b>Please note, only one default clan can be set per server</b>.
        </Text>
        <Image alt="Add Abbreviation Example" height="100" src="/assets/docs/set-default-clan.webp" unoptimized />
      </Stack>

      <Divider color="gray.7" size="sm" />

      <Stack align="flex-start">
        <Title fw="600" size="h2">
          Linking Your Player Profile
        </Title>
        <Text c="gray.1">
          Just like setting abbreviations or a default clan, you can link your Clash Royale player profile to your
          Discord account. This lets you skip entering your player tag for every command and simply run commands without
          any extra input.
        </Text>
        <Text>
          Slash Command: <code>/link &lt;TAG&gt;</code>
        </Text>
      </Stack>
    </Stack>
  )
}
