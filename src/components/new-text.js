import { Text } from "@mantine/core"

export default function NewText({ fontSize }) {
  return (
    <Text fw="700" fz={fontSize || "0.9rem"} variant="gradient">
      NEW
    </Text>
  )
}
