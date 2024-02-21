import { Container } from "@mantine/core"

import ComingSoon from "@/components/ui/coming-soon"

export const metadata = {
  description: "View my saved players in CWStats.",
  title: "My Players | CWStats",
}

export default function PlayersPage() {
  return (
    <Container size="lg">
      <ComingSoon />
    </Container>
  )
}
