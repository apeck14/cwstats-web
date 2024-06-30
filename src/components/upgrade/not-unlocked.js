import { Button, Stack, Text, Title } from "@mantine/core"
import { IconLock } from "@tabler/icons-react"
import Link from "next/link"

export default function NotUnlocked() {
  return (
    <Stack align="center" my="10dvh">
      <IconLock color="var(--mantine-color-orange-6)" size="5rem" />
      <Title size="h2">Feature not unlocked</Title>
      <Text c="gray.1" fw="500" ta="center">
        This is a CWStats Plus feature. To access this feature, activate Plus for free.
      </Text>
      <Button bg="orange.6" className="buttonHover" component={Link} href="/upgrade" mt="xs" w="6rem">
        Activate
      </Button>
    </Stack>
  )
}
