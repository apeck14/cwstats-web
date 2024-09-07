"use client"

import { Paper } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { Area, Bar, ComposedChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const roundToNearest25 = (int) => Math.round(int / 25) * 25

const generateYTicks = (min, max) => {
  const increment = max - min >= 100 ? 50 : 25
  const result = []
  for (let i = min; i <= max; i += increment) {
    result.push(i)
  }

  return result
}

// return first, last and up to 2 in between ticks
const generateXTicks = (hours) => {
  if (hours.length <= 4) {
    return hours
  }

  const first = hours[0]
  const last = hours[hours.length - 1]

  const step = (hours.length - 1) / 3

  const secondIndex = Math.round(step)
  const thirdIndex = Math.round(2 * step)

  const second = hours[secondIndex]
  const third = hours[thirdIndex]

  return [first, second, third, last]
}

export default function HourlyAverageGraph({ allData, selectedDay: { day, season, week } }) {
  const isMobile = useMediaQuery("(max-width: 30em)")

  const data =
    allData?.[season]?.[week]?.[day].map((e) => {
      const { avg, lastHourAvg, timestamp } = e
      const date = new Date(timestamp)
      const formattedHour = date.getUTCHours()

      return { "Fame Avg.": avg.toFixed(1), hour: formattedHour, "Last Hour Avg.": lastHourAvg?.toFixed(1) }
    }) || {}

  const values = Object.values(data)
  const averages = values.map((e) => e["Fame Avg."])
  const lastHourAverages = values.map((e) => e["Last Hour Avg."] || false)
  const dataMin = Math.min(...averages, ...lastHourAverages)
  const dataMax = Math.max(...averages, ...lastHourAverages)
  const yAxisMin = roundToNearest25(dataMin - 25 < 0 ? 0 : dataMin - 25)
  const yAxisMax = dataMax > 225 ? 250 : 225

  const barSize = isMobile ? 10 : 35

  return (
    <Paper
      bg="gray.8"
      mih={isMobile ? "19rem" : "25rem"}
      pb={{ base: "sm", md: "md" }}
      pr={{ base: "md", md: "lg" }}
      pt={{ base: "xl", md: "3rem" }}
      radius="md"
    >
      {Object.keys(data).length ? (
        <ResponsiveContainer height={isMobile ? 250 : 400} width="100%">
          <ComposedChart data={data}>
            <XAxis
              dataKey="hour"
              fontSize={isMobile ? "0.8rem" : "0.9rem"}
              fontWeight={600}
              ticks={generateXTicks(values.map((e) => e.hour))}
            >
              <Label dy={14} fontSize={isMobile ? "0.75rem" : "0.85rem"} fontWeight={600} value="Time (UTC)" />
            </XAxis>
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              fontSize={isMobile ? "0.8rem" : "0.9rem"}
              fontWeight={600}
              ticks={generateYTicks(yAxisMin, yAxisMax)}
              width={isMobile ? 35 : 50}
            />
            <Bar
              barSize={barSize}
              dataKey="Last Hour Avg."
              fill="var(--mantine-color-gray-6)"
              radius={isMobile ? [3, 3, 0, 0] : [5, 5, 0, 0]}
            />
            <Area
              dataKey="Fame Avg."
              fill="var(--mantine-color-orange-5)"
              fillOpacity={0.25}
              stroke="var(--mantine-color-orange-5)"
              strokeWidth={5}
              type="monotone"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--mantine-color-gray-8)",
                borderColor: "var(--mantine-color-gray-5)",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
              labelFormatter={(val) => `Time (UTC): ${val}`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : null}
    </Paper>
  )
}
