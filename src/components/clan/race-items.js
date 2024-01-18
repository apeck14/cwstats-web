import { Group, Stack } from "@mantine/core"

export default function RaceItems({ item }) {
  const { badgeId, boatPoints, crossedFinishLine, fame, name, placement, tag, trophies } = item
  return (
    <Group>
      <Stack>
        <Group>{name}</Group>
        <Group>{avg}</Group>
      </Stack>
    </Group>
  )
}
