import { TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"

export default function ClanSearch({ onChange, value }) {
  return (
    <TextInput
      leftSection={<IconSearch style={{ height: "1rem", width: "1rem" }} />}
      miw="30%"
      onChange={onChange}
      placeholder="Search clans..."
      style={{ flexGrow: 1 }}
      value={value}
    />
  )
}
