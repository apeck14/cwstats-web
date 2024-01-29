"use client"

import { Group, Pagination, Progress, Stack, Table, Text, Tooltip } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { getClanBadgeFileName, getRegionById } from "../../lib/functions/utils"
import Image from "../ui/image"
import classes from "./leaderboard.module.css"

export default function LeaderboardTable({ clans, league, savedClans, search, showSavedClans }) {
  const [leaderboard, setLeaderboard] = useState(clans)
  const [page, setPage] = useState(1)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 30em)")

  const start = 0 + 50 * (page - 1)
  const end = 50 * page

  const rows = leaderboard.slice(start, end).map((c, i) => {
    const key = c.location?.countryCode || getRegionById(c.location.id)?.key || "unknown"
    const formattedKey = key.toLowerCase()
    const flagHref = `${pathname.slice(0, pathname.lastIndexOf("/"))}/${formattedKey}?${searchParams.toString()}`

    return (
      <Table.Tr fw={500} fz={{ base: "0.8rem", md: "1rem" }} key={c.tag}>
        <Table.Td py="sm" ta="center">
          <Group fz={{ base: "0.65rem", md: "0.95rem" }} gap="0.2rem" justify="center">
            {c.notRanked ? "NR" : i + start + 1}
            {!c.notRanked && (
              <span style={{ color: "var(--mantine-color-gray-2)" }}>
                ({clans.findIndex((cl) => cl.tag === c.tag) + 1})
              </span>
            )}
          </Group>
        </Table.Td>
        <Table.Td>
          <Group gap={isMobile ? "xs" : "md"}>
            <Image
              height={isMobile ? 20 : 28}
              src={`/assets/badges/${getClanBadgeFileName(c.badgeId, c.clanScore)}.png`}
            />
            <Link className="pinkText" href={`/clan/${c.tag.substring(1)}/race`}>
              {c.name}
            </Link>
          </Group>
        </Table.Td>
        <Table.Td className={classes.flagCell} ta="center">
          <Link href={flagHref}>
            <Image
              className={classes.flag}
              height={isMobile ? 16 : 24}
              src={`/assets/flag-icons/${formattedKey}.webp`}
            />
          </Link>
        </Table.Td>
        <Table.Td fz={{ base: "0.65rem", md: "0.95rem" }} ta="center">
          {Number(c.rank) ? `#${c.rank}` : <span style={{ color: "var(--mantine-color-gray-4)" }}>N/A</span>}
        </Table.Td>
        <Table.Td fz={{ base: "0.65rem", md: "0.95rem" }} ta="center" visibleFrom="md">
          {c.clanScore}
        </Table.Td>
        <Table.Td fz={{ base: "0.65rem", md: "0.95rem" }} ta="center">
          {c.decksRemaining}
        </Table.Td>
        <Table.Td ta="center">
          <Stack gap="0.2rem">
            <Text fw={600} fz={{ base: "0.7rem", md: "0.95rem" }}>
              {c.fameAvg.toFixed(2)}
            </Text>
            <Progress size="xs" value={((c.fameAvg - 100) / 125) * 100} />
          </Stack>
        </Table.Td>
      </Table.Tr>
    )
  })

  useEffect(() => {
    const filtered = clans.filter((c) => {
      if (showSavedClans && !savedClans.includes(c.tag)) return false
      if (league === "5000+" && c.clanScore < 5000) return false
      if (league === "4000" && (c.clanScore >= 5000 || c.clanScore < 4000)) return false
      if (search && !c.name.toLowerCase().includes(search)) return false
      return true
    })

    setPage(1)
    setLeaderboard(filtered)
  }, [league, showSavedClans, search])

  return (
    <Stack>
      <Stack align="flex-end" gap="0.5rem" my="md">
        <Pagination
          disabled={leaderboard.length === 0}
          onChange={setPage}
          size={isMobile ? "xs" : "sm"}
          total={leaderboard.length === 0 ? 1 : Math.ceil(leaderboard.length / 50)}
          value={page}
        />
        <Text c="gray.1" fz="xs">
          {leaderboard.length} clan(s)
        </Text>
      </Stack>

      <Table className="ignoreContainerPadding" highlightOnHover striped>
        <Table.Thead>
          <Table.Tr className={classes.th}>
            <Table.Th ta="center">
              <Tooltip bg="gray.6" c="white" label="Rank (Region Rank)" withArrow>
                <Text fw={700} fz={{ base: "0.9rem", md: "1rem" }}>
                  #
                </Text>
              </Tooltip>
            </Table.Th>
            <Table.Th />
            <Table.Th />
            <Table.Th>
              <Image height={16} src="/assets/flag-icons/global.webp" />
            </Table.Th>
            <Table.Th visibleFrom="md">
              <Image height={16} src="/assets/icons/cw-trophy.png" />
            </Table.Th>
            <Table.Th>
              <Image height={16} src="/assets/icons/decksRemaining.png" />
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        {rows.length ? <Table.Tbody>{rows}</Table.Tbody> : null}
      </Table>
      {!rows.length ? (
        <Group c="gray.1" fw={600} fz="sm" justify="center">
          No clans found
        </Group>
      ) : null}
    </Stack>
  )
}
