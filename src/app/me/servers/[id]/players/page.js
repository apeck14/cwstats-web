import { Text } from "@mantine/core"

import ServerHeader from "@/components/me/header"

export const dynamic = "force-dynamic"

export default async function ChannelsPage({ params }) {
  return (
    <>
      <ServerHeader id={params.id} />
      <Text>Test</Text>
    </>
  )
}
