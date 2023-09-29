import dynamic from "next/dynamic"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import { timestamptoHHMM } from "../../../utils/date-time"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function DailyAvgGraph({ data, title }) {
  const { width } = useWindowSize()
  const options = {
    chart: {
      fontFamily: "inherit",
      id: "daily-averages",
      toolbar: {
        show: false,
        tools: {
          pan: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
        },
      },
    },
    fill: {
      gradient: {
        gradientToColors: [orange],
        stops: [0, 100, 100, 100],
      },
      type: "gradient",
    },
    grid: {
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    stroke: {
      colors: [pink, orange],
      curve: "smooth",
    },
    theme: {
      monochrome: {
        color: pink,
        enabled: true,
      },
    },
    title: {
      align: "middle",
      style: {
        color: gray["0"],
        fontSize: "20px",
      },
      text: title,
    },
    tooltip: {
      theme: "dark",
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: gray["25"],
        height: 4,
      },
      categories: data.map((a) => timestamptoHHMM(a.timestamp)),
      crosshairs: {
        show: false,
      },
      labels: {
        offsetY: 5,
        show: true,
        style: {
          colors: data.map((a, i) => (i % 2 === 0 ? gray["50"] : gray["100"])),
          fontSize: width <= 480 ? "8px" : "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [gray["25"]],
        },
      },
      tickAmount: 5,
    },
  }

  const series = [
    {
      data: data.map((a) => a.fameAvg.toFixed(1)),
      name: "Fame Avg.",
    },
  ]

  return <Chart height="100%" options={options} series={series} type="line" width="100%" />
}
