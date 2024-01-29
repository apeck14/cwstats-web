import { CloseButton, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"

export default function ClanSearch({ onChange, reset, value }) {
  return (
    <TextInput
      leftSection={<IconSearch style={{ height: "1rem", width: "1rem" }} />}
      miw="30%"
      onChange={onChange}
      placeholder="Search clans..."
      rightSection={value && <CloseButton onClick={reset} size="sm" />}
      style={{ flexGrow: 1 }}
      value={value}
    />
  )
}
