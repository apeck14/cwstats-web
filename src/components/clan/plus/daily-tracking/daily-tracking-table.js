import { Group, Stack, Table, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCaretDownFilled, IconCaretUpFilled } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import Image from '@/components/ui/image'

import classes from './daily-tracking.module.css'

const columns = {
  attacks: (key, asc) => {
    const isTotal = key.includes('total')

    if (isTotal) {
      if (asc) return (a, b) => a.totalAttacks - b.totalAttacks
      return (a, b) => b.totalAttacks - a.totalAttacks
    }

    const dayIndex = Number(key.charAt(3)) - 1

    if (asc)
      return (a, b) => {
        const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
        const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

        if (aAttacks === bAttacks) return bFame - aFame
        return aAttacks - bAttacks
      }
    return (a, b) => {
      const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
      const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

      if (aAttacks === bAttacks) return bFame - aFame
      return bAttacks - aAttacks
    }
  },
  avg: (key, asc) => {
    if (asc)
      return (a, b) => {
        if (a.avg === b.avg) return b.totalAttacks - a.totalAttacks
        return a.avg - b.avg
      }
    return (a, b) => {
      if (a.avg === b.avg) return b.totalAttacks - a.totalAttacks
      return b.avg - a.avg
    }
  },
  fame: (key, asc) => {
    const isTotal = key.includes('total')

    if (isTotal) {
      if (asc) return (a, b) => a.totalFame - b.totalFame
      return (a, b) => b.totalFame - a.totalFame
    }

    const dayIndex = Number(key.charAt(3)) - 1

    if (asc)
      return (a, b) => {
        const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
        const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

        if (aFame === bFame) return bAttacks - aAttacks
        return aFame - bFame
      }
    return (a, b) => {
      const { attacks: aAttacks, fame: aFame } = a.scores[dayIndex]
      const { attacks: bAttacks, fame: bFame } = b.scores[dayIndex]

      if (aFame === bFame) return bAttacks - aAttacks
      return bFame - aFame
    }
  },
  player: (key, asc) => {
    if (asc) return (a, b) => b.name.localeCompare(a.name)
    return (a, b) => a.name.localeCompare(b.name)
  }
}

const cellColors = [
  'rgb(43, 138, 62, 0.5)', // 225
  'rgb(81, 207, 102, 0.6)', // 200
  'rgb(169, 227, 75, 0.4)', // 175
  'rgb(250, 176, 5, 0.4)', // 150
  'rgb(255, 146, 43, 0.6)', // 125
  'rgb(250, 82, 82, 0.6)' // 100 avg or less than 400 fame
]

function getWeekData(week) {
  const tableData = {}

  for (let i = 0; i < week.length; i++) {
    const day = week[i]
    const dayIndex = day.day - 1

    for (const entry of day.scores) {
      if (!entry.fame && !entry.missed) continue

      if (entry.tag in tableData) {
        tableData[entry.tag].scores[dayIndex] = { attacks: entry.attacks, fame: entry.fame, missed: entry.missed }
        tableData[entry.tag].totalFame += entry.fame
        tableData[entry.tag].totalAttacks += entry.attacks
      } else {
        const scores = Array(4).fill({ attacks: 0, fame: 0 })

        scores[dayIndex] = { attacks: entry.attacks, fame: entry.fame, missed: entry.missed }

        tableData[entry.tag] = {
          name: entry.name,
          scores,
          tag: entry.tag,
          totalAttacks: entry.attacks,
          totalFame: entry.fame
        }
      }
    }
  }

  // add avg
  for (const tag of Object.keys(tableData)) {
    const { totalAttacks, totalFame } = tableData[tag]

    tableData[tag].avg = totalAttacks ? totalFame / totalAttacks : 0
  }

  return tableData
}

function getFameCellColor(attacks, fame, missed) {
  if ((attacks > 0 && fame < 400) || (missed && !fame)) return cellColors[cellColors.length - 1]
  if (!fame || !attacks) return

  const avg = fame / attacks
  const thresholds = [225, 200, 175, 150, 125]
  const index = thresholds.findIndex((t) => avg >= t)

  return cellColors[index === -1 ? 5 : index]
}

export default function DailyTrackingTable({ data, week }) {
  const isLessThanTablet = useMediaQuery('(max-width: calc(48em - 1px))')
  const [sortConfig, setSortConfig] = useState({
    col: 'fame',
    dir: 'dsc',
    key: 'totalFame'
  })

  const weekData = data[week]
  const tableData = useMemo(() => getWeekData(weekData), [weekData])

  const handleThClick = (key, col) => {
    const sameKey = key === sortConfig.key

    setSortConfig({
      col: col || key,
      dir: sameKey ? (sortConfig.dir === 'asc' ? 'dsc' : 'asc') : 'dsc',
      key
    })
  }

  const showCaret = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.dir === 'asc') return <IconCaretUpFilled size={isLessThanTablet ? '0.75rem' : '1rem'} />
      return <IconCaretDownFilled size={isLessThanTablet ? '0.75rem' : '1rem'} />
    }

    return null
  }

  const rows = useMemo(
    () =>
      Object.values(tableData)
        .sort(columns[sortConfig.col](sortConfig.key, sortConfig.dir === 'asc'))
        .map((entry, i) => (
          <Table.Tr fw='600' fz={{ base: '0.65rem', md: '0.85rem' }} key={entry.tag}>
            <Table.Td bg='gray.10' px='0' ta='center'>
              {i + 1}
            </Table.Td>
            <Table.Td fz={{ base: '0.75rem', md: '0.9rem' }}>
              <Link className='pinkText' href={`/player/${entry.tag.substring(1)}`} prefetch={false}>
                {entry.name}
              </Link>
            </Table.Td>
            {entry.scores.map((s, i) => {
              let fameCellBg = getFameCellColor(s.attacks, s.fame, s.missed)

              // show stripes for missed attacks
              if ('missed' in s && ((s.attacks === 0 && s.missed) || s.attacks % 4 !== 0)) {
                fameCellBg = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${fameCellBg} 10px, ${fameCellBg} 20px)`
              }

              return (
                <React.Fragment key={`${entry.tag}-${i}`}>
                  <Table.Td ta='center' visibleFrom='md'>
                    {s.attacks}
                  </Table.Td>
                  <Table.Td bg={fameCellBg} colSpan={isLessThanTablet && 2} ta='center'>
                    {isLessThanTablet ? (
                      <Stack gap='0'>
                        <Text fz={{ base: '0.65rem', md: '0.85rem' }}>{s.fame}</Text>
                        <Text fz={{ base: '0.65rem', md: '0.85rem' }}>({s.attacks})</Text>
                      </Stack>
                    ) : (
                      s.fame
                    )}
                  </Table.Td>
                </React.Fragment>
              )
            })}
            <Table.Td ta='center' visibleFrom='md'>
              {entry.avg.toFixed(1)}
            </Table.Td>
            <Table.Td ta='center' visibleFrom='md'>
              {entry.totalAttacks}
            </Table.Td>
            <Table.Td colSpan={isLessThanTablet && 2} ta='center'>
              {isLessThanTablet ? (
                <Stack gap='0'>
                  <Text fz={{ base: '0.65rem', md: '0.85rem' }}>{entry.totalFame}</Text>
                  <Text fz={{ base: '0.65rem', md: '0.85rem' }}>({entry.totalAttacks})</Text>
                </Stack>
              ) : (
                entry.totalFame
              )}
            </Table.Td>
          </Table.Tr>
        )),
    [sortConfig, isLessThanTablet, tableData]
  )

  return (
    <Table className='ignoreContainerPadding' highlightOnHover layout='fixed' mt='md' striped withColumnBorders>
      <Table.Thead fz={{ base: '0.65rem', md: '0.9rem' }}>
        <Table.Tr>
          <Table.Th bg='gray.10' px='0' rowSpan={2} ta='center' w={{ base: '1.25rem', md: '2.5rem' }}>
            #
          </Table.Th>
          <Table.Th
            className={isLessThanTablet ? null : classes.hoverableTh}
            onClick={() => handleThClick('player')}
            rowSpan={2}
            ta='center'
            w={{ base: '7rem', lg: '20%', md: '10rem' }}
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Player
              </Text>
              {showCaret('player')}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isLessThanTablet ? 9 : 10}`}
            colSpan={2}
            onClick={isLessThanTablet ? () => handleThClick('day1Fame', 'fame') : () => {}}
            px='0'
            rowSpan={isLessThanTablet && 2}
            ta='center'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Day 1
              </Text>
              {isLessThanTablet && showCaret('day1Fame')}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isLessThanTablet ? 9 : 10}`}
            colSpan={2}
            onClick={isLessThanTablet ? () => handleThClick('day2Fame', 'fame') : () => {}}
            px='0'
            rowSpan={isLessThanTablet && 2}
            ta='center'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Day 2
              </Text>
              {isLessThanTablet && showCaret('day2Fame')}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isLessThanTablet ? 9 : 10}`}
            colSpan={2}
            onClick={isLessThanTablet ? () => handleThClick('day3Fame', 'fame') : () => {}}
            px='0'
            rowSpan={isLessThanTablet && 2}
            ta='center'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Day 3
              </Text>
              {isLessThanTablet && showCaret('day3Fame')}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isLessThanTablet ? 9 : 10}`}
            colSpan={2}
            onClick={isLessThanTablet ? () => handleThClick('day4Fame', 'fame') : () => {}}
            px='0'
            rowSpan={isLessThanTablet && 2}
            ta='center'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Day 4
              </Text>
              {isLessThanTablet && showCaret('day4Fame')}
            </Group>
          </Table.Th>
          <Table.Th
            className={classes.hoverableTh}
            onClick={() => handleThClick('avg')}
            rowSpan={2}
            ta='center'
            visibleFrom='md'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz='0.9rem'>
                Avg.
              </Text>
              {showCaret('avg')}
            </Group>
          </Table.Th>
          <Table.Th
            bg={`gray.${isLessThanTablet ? 9 : 10}`}
            colSpan={2}
            onClick={isLessThanTablet ? () => handleThClick('totalFame', 'fame') : () => {}}
            px='0'
            ta='center'
          >
            <Group gap={0} justify='center'>
              <Text fw={700} fz={{ base: '0.65rem', md: '0.9rem' }}>
                Total
              </Text>
              {isLessThanTablet && showCaret('totalFame')}
            </Group>
          </Table.Th>
        </Table.Tr>
        <Table.Tr className='noselect'>
          {[1, 2, 3, 4, 'total'].map((d) => {
            const prefix = d === 'total' ? d : `day${d}`
            return (
              <React.Fragment key={d}>
                <Table.Th
                  className={classes.hoverableTh}
                  onClick={() => handleThClick(`${prefix}Attacks`, 'attacks')}
                  px='0'
                  visibleFrom='md'
                >
                  <Group gap={0} justify='center'>
                    <Image alt='Attacks' height='16' src='/assets/icons/decksRemaining.webp' />
                    {showCaret(`${prefix}Attacks`)}
                  </Group>
                </Table.Th>
                <Table.Th
                  className={classes.hoverableTh}
                  onClick={() => handleThClick(`${prefix}Fame`, 'fame')}
                  px='0'
                  visibleFrom='md'
                >
                  <Group gap={0} justify='center'>
                    <Image alt='Fame' height='16' src='/assets/icons/fame.webp' />
                    {showCaret(`${prefix}Fame`)}
                  </Group>
                </Table.Th>
              </React.Fragment>
            )
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody fw='500'>{rows}</Table.Tbody>
    </Table>
  )
}
