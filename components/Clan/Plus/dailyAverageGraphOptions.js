const { pink, orange } = require("../../../public/static/colors")

module.exports = {
  chart: {
    id: "daily-averages",
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
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [data.map(() => "")],
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    min: 100,
    max: 250,
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
    text: "Daily Clan Averages",
    align: "left",
    style: {
      color: gray["0"],
      fontFamily: "inherit",
      fontSize: "20px",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
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
