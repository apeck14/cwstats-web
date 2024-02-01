import { Container } from "@mantine/core"

import ComingSoon from "../../../components/ui/coming-soon"

export const metadata = {
  description: "View my Discord servers in CWStats.",
  title: "My Servers | CWStats",
}

export default function ServersPage() {
  return (
    <Container size="lg">
      <ComingSoon />
    </Container>
  )
}
