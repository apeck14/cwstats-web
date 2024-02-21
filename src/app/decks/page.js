import { Container } from "@mantine/core"

import ComingSoon from "@/components/ui/coming-soon"

export const metadata = {
  description: "Navigate the top rated war decks to boost your gameplay!",
  title: "Decks | CWStats",
}

export default function DecksPage() {
  return (
    <Container size="lg">
      <ComingSoon />
    </Container>
  )
}
