"use client"

import { AreaChart } from "@mantine/charts"
import { Paper } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

const roundToNearest25 = (int) => Math.round(int / 25) * 25

const generateYTicks = (min, max) => {
  const result = []
  for (let i = min; i <= max; i += 25) {
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

  const data = allData[season][week][day].map((e) => {
    const { avg, timestamp } = e
    const date = new Date(timestamp)
    const formattedHour = date.getUTCHours()

    return { avg: avg.toFixed(1), hour: formattedHour }
  })

  const values = Object.values(data)
  const averages = values.map((e) => e.avg)
  const dataMin = Math.min(...averages)
  const dataMax = Math.max(...averages)
  const yAxisMin = roundToNearest25(dataMin - 25 < 0 ? 0 : dataMin - 25)
  const yAxisMax = dataMax > 225 ? 250 : 225

  return (
    <Paper bg="gray.8" pb={{ base: "sm", md: "md" }} pt={{ base: "xl", md: "3rem" }} radius="md">
      <AreaChart
        areaChartProps={{ allowDataOverflow: false }}
        curveType="natural"
        data={values}
        dataKey="hour"
        h={400}
        rightYAxisProps={{ width: isMobile ? 25 : 40 }}
        series={[
          {
            color: "orange.6",
            label: `Fame Avg.`,
            name: "avg",
          },
        ]}
        strokeWidth={5}
        tooltipAnimationDuration={200}
        withGradient
        xAxisLabel="Time (UTC)"
        xAxisProps={{ ticks: generateXTicks(values.map((e) => e.hour)) }}
        yAxisProps={{
          domain: [yAxisMin, yAxisMax],
          ticks: generateYTicks(yAxisMin, yAxisMax),
          width: isMobile ? 50 : 60,
        }}
      />
    </Paper>
  )
}
