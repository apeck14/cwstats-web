import dynamic from "next/dynamic"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import { timestamptoHHMM } from "../../../utils/date-time"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function DailyAvgGraph({ data, title }) {
  const { width } = useWindowSize()
  const options = {
    chart: {
      id: "daily-averages",
      fontFamily: "inherit",
      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: pink,
      },
    },
    stroke: {
      curve: "smooth",
      colors: [pink, orange],
    },
    xaxis: {
      categories: data.map((a) => timestamptoHHMM(a.timestamp)),
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: data.map((a, i) => (i % 2 === 0 ? gray["50"] : gray["100"])),
          fontSize: width <= 480 ? "8px" : "12px",
        },
        offsetY: 5,
      },
      crosshairs: {
        show: false,
      },
      axisTicks: {
        color: gray["25"],
        height: 4,
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: [gray["25"]],
        },
      },
    },
    grid: {
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    title: {
      text: title,
      align: "middle",
      style: {
        color: gray["0"],
        fontSize: "20px",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: [orange],
        stops: [0, 100, 100, 100],
      },
    },
    tooltip: {
      theme: "dark",
    },
  }

  const series = [
    {
      name: "Fame Avg.",
      data: data.map((a) => a.fameAvg.toFixed(1)),
    },
  ]

  return <Chart options={options} series={series} type="line" width="100%" height="100%" />
}
