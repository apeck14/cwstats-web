import { Container } from "@mantine/core"

import ComingSoon from "@/components/ui/coming-soon"

export const metadata = {
  description: "View my saved clans in CWStats.",
  title: "My Clans | CWStats",
}

export default function ClansPage() {
  return (
    <Container size="lg">
      <ComingSoon />
    </Container>
  )
}
