import { Container, Stack, Title } from "@mantine/core"

import FeatureCards from "@/components/upgrade/feature-cards"
import UpgradeHeader from "@/components/upgrade/header"

export const metadata = {
  description: "Upgrade to CWStats+ or Pro, and take full advantage of all CWStats features.",
  title: "Upgrade | CWStats",
}

export default function UpgradePage() {
  return (
    <Stack mt="-1rem">
      <Stack bg="gray.10" w="100%">
        <Container size="lg">
          <UpgradeHeader />
        </Container>
      </Stack>

      <Container align="center" component={Stack} pb="1rem" size="lg" w="100%">
        <Title mt="3rem" ta="center">
          What&apos;s included
        </Title>
        <FeatureCards />
      </Container>
    </Stack>
  )
}
