import { SegmentedControl } from "@mantine/core"

export default function LeagueSegmentControl({ onChange, value }) {
  const options = ["All", "5000+", "4000"]
  const val = value === "5000" ? options[1] : value === "4000" ? options[2] : options[0]

  return <SegmentedControl data={options} miw="10rem" onChange={onChange} value={val} />
}
