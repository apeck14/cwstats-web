import { Container } from "@mantine/core"

import ComingSoon from "../../components/ui/coming-soon"

export const metadata = {
  description: "Learn how to get started with CWStats through real examples and detailed explanations.",
  title: "Docs | CWStats",
}

export default function DocsPage() {
  return (
    <Container size="lg">
      <ComingSoon />
    </Container>
  )
}
