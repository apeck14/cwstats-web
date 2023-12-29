"use client"

import { Button, Popover, Stack, Table, Text } from "@mantine/core"

import useWindowSize from "../../hooks/useWindowSize"
import { breakpointObj } from "../../lib/functions"
import PlusFormModal from "./plus-form-modal"

const data = [
  { isHeader: true, name: "Discord Bot" },
  { name: "Access to all Slash Commands", plus: true, premium: true, standard: true },
  { name: "Web Dashboard for configuration", plus: true, premium: true, standard: true },
  { name: "Automated application system", plus: true, premium: true, standard: true },
  { name: "Clan Abbreviations", plus: 20, premium: 30, standard: 15 },
  { name: "Scheduled Nudges", plus: 5, premium: 10, standard: 1 },
  // { name: "Daily War Reports (missed attacks, daily scores, etc.)", plus: 1, premium: 5, standard: 1 },
  { name: "Linked Accounts for Nudging", plus: 300, premium: 500, standard: 75 },
  { name: "Global Abbreviations", premium: 1 },
  { isHeader: true, name: "Clan Analytics" },
  { name: "Race averages and projections", plus: true, premium: true, standard: true },
  { name: "Global & local daily leaderboards", plus: true, premium: true, standard: true },
  { name: "Hourly Clan Average Tracking", plus: true, premium: true },
  { name: "Access to all Slash Commands", plus: true, premium: true, standard: true },
  { name: "Daily Clan Tracking (player scores, etc.)", plus: true, premium: true },
  { name: "Player Matches Tracking", premium: true },
  { isHeader: true, name: "Other" },
  { name: "Special Clan Badge", plus: true, premium: true },
  { name: "Special Player Badge", premium: true },
  { name: "Vanity URL (cwstats.com/your_url)", premium: true },
  { name: "Social Media Links on Player & Clan page", premium: true },
]

export default function FeatureTable() {
  const { breakpoint } = useWindowSize()

  const rows = data.map((f) => (
    <Table.Tr fw={500} fz={breakpointObj("0.7rem", "0.8rem", "1rem")[breakpoint]} key={f}>
      <Table.Td
        c={f.isHeader ? "white" : "gray.1"}
        fw={f.isHeader && 700}
        fz={f.isHeader && breakpointObj("1rem", "1rem", "1.25rem")[breakpoint]}
        pl={!f.isHeader && breakpointObj("xs", "sm", "xl")[breakpoint]}
        pt={f.isHeader && breakpointObj("sm", "md", "xl")[breakpoint]}
      >
        {f.name}
      </Table.Td>
      <Table.Td ta="center" visibleFrom="md">
        {Number.isInteger(f.standard) ? f.standard : f.standard && "✅"}
      </Table.Td>
      <Table.Td bg="gray.10" ta="center">
        {Number.isInteger(f.plus) ? f.plus : f.plus && "✅"}
      </Table.Td>
      <Table.Td bg="gray.11" ta="center">
        {Number.isInteger(f.premium) ? f.premium : f.premium && "✅"}
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table my="3rem" verticalSpacing={breakpointObj("xs", "sm", "md")[breakpoint]} w="100%" withRowBorders={false}>
      <Table.Thead>
        <Table.Tr
          fz={breakpointObj("0.8rem", "1rem", "1.25rem", "1.5rem")[breakpoint]}
          style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}
        >
          <Table.Th w={breakpointObj("12rem", "15rem", "20rem")[breakpoint]} />
          <Table.Th c="gray.3" ta="center" visibleFrom="md">
            Standard
          </Table.Th>
          <Table.Th bg="gray.10" c="orange.5" style={{ borderTopLeftRadius: "0.5rem" }} ta="center">
            <Stack gap="xs">
              CWStats+
              <Text c="gray.6" fw={700} size={breakpointObj("sm", "sm", "lg")[breakpoint]}>
                FREE
              </Text>
            </Stack>
          </Table.Th>
          <Table.Th bg="gray.11" c="pink.6" style={{ borderTopRightRadius: "0.5rem" }} ta="center">
            <Stack gap="xs">
              Premium
              <Text c="gray.6" fw={700} size={breakpointObj("sm", "sm", "lg")[breakpoint]}>
                TBD
              </Text>
            </Stack>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows}
        <Table.Tr>
          <Table.Td />
          <Table.Td visibleFrom="md" />
          <Table.Td>
            <PlusFormModal />
          </Table.Td>
          <Table.Td>
            <Popover position="top" shadow="md" width={200} withArrow>
              <Popover.Target>
                <Button
                  className="buttonHover"
                  gradient={{ deg: 90, from: "pink", to: "pink.4" }}
                  variant="gradient"
                  w="100%"
                >
                  Activate
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm" ta="center">
                  Premium coming soon! 🎉
                </Text>
              </Popover.Dropdown>
            </Popover>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )
}
