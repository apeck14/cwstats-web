import { Container, Stack, Title } from "@mantine/core"

import FeatureTable from "../../components/upgrade/feature-table"
import UpgradeHeader from "../../components/upgrade/header"

export default function UpgradePage() {
  return (
    <Stack mt="-1rem">
      <Stack bg="gray.10" w="100%">
        <Container size="lg">
          <UpgradeHeader />
        </Container>
      </Stack>

      <Stack>
        <Container pb="1rem" size="lg" w="100%">
          <Title mt="3rem" ta="center">
            What&apos;s included
          </Title>
          <FeatureTable />
        </Container>
      </Stack>
    </Stack>
  )
}
