"use client"

import { Container, Pagination, SimpleGrid, Stack } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useMemo, useState } from "react"

import ClanSearchCard from "./clan-card"
import SearchFilters from "./results-filters"

export default function SearchResultsContent({ params, results }) {
  const [page, setPage] = useState(1)
  const [trophies, setTrophies] = useState(parseInt(params.trophies) || 0)
  const isMobile = useMediaQuery("(max-width: 30em)")
  const isTablet = useMediaQuery("(max-width: 48em)")
  const isLaptop = useMediaQuery("(max-width: 64em)")

  const start = 30 * (page - 1)
  const end = 30 * page

  const filteredResults = useMemo(() => results.filter((c) => c.clanWarTrophies >= trophies), [results])

  return (
    <Container mb="xl" px={{ base: "md", xl: 0 }} size="lg">
      <SearchFilters
        params={params}
        resultsFound={filteredResults.length}
        setTrophies={setTrophies}
        trophies={trophies}
      />

      <Stack align="flex-end" mb="xl" mt="md">
        <Pagination
          disabled={filteredResults.length === 0}
          onChange={setPage}
          size={isMobile ? "xs" : "sm"}
          total={filteredResults.length === 0 ? 1 : Math.ceil(filteredResults.length / 30)}
          value={page}
        />
      </Stack>

      <SimpleGrid cols={isTablet ? 1 : isLaptop ? 2 : 3}>
        {filteredResults.slice(start, end).map((c) => (
          <ClanSearchCard clan={c} key={c.tag} />
        ))}
      </SimpleGrid>
    </Container>
  )
}
