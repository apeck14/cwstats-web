import { Container, Group, Title } from "@mantine/core"

import { searchClans } from "@/actions/supercell"
import SearchResultsContent from "@/components/clan/search/results-content"
import Image from "@/components/ui/image"
import { getClanSearchParams } from "@/lib/functions/utils"

export const metadata = {
  description: "Filter clans by name, location, trophies, members & more!",
  title: "Clan Search | CWStats",
}

export default async function ClanSearch({ searchParams }) {
  const params = getClanSearchParams(searchParams)
  const { data: results } = await searchClans(params, false)

  return (
    <>
      <Group className="header" py="3rem">
        <Container px={{ base: "md", xl: 0 }} size="lg" w="100%">
          <Group justify="space-between">
            <Title fz={{ base: "2rem", md: "3rem" }}>Clan Search</Title>
            <Image alt="CWStats" height={64} src="/assets/icons/logo.webp" />
          </Group>
        </Container>
      </Group>
      <SearchResultsContent params={params} results={results || []} />
    </>
  )
}
