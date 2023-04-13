import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"
import { lcs } from "string-comparison"
import styled from "styled-components"

import SearchContent from "../../components/Clan/Search/SearchContent"
import SearchBar from "../../components/Home/SearchBar"
import { gray, orange } from "../../public/static/colors"
import { getClanSearchResults } from "../../utils/services"

const Header = styled.h1`
  color: ${gray["0"]};
  font-size: 3.5rem;
  text-align: center;
  margin-top: 3rem;

  @media (max-width: 480px) {
    margin-top: 2rem;
    font-size: 2.5rem;
  }
`

const SearchBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`

const HeaderDiv = styled.div`
  background-color: ${gray["75"]};
  padding: 1rem;
  margin-top: 2rem;
  border-bottom: 2px solid ${orange};
  border-radius: 0.5rem 0.5rem 0 0;
`

const Text = styled.p`
  color: ${gray["0"]};

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

export default function ClanSearch() {
  const router = useRouter()
  const [clans, setClans] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { q } = router.query

  useEffect(() => {
    if (q) {
      const trimmedQuery = q.trim()

      if (trimmedQuery.length > 0 && router) {
        getClanSearchResults(trimmedQuery)
          .then((data) => {
            const sorted = lcs
              .sortMatch(
                trimmedQuery,
                data.map((c) => c.name)
              )
              .sort((a, b) => b.rating - a.rating)
              .map((c) => data.find((cl) => cl.name === c.member))

            setClans(sorted)
            setIsLoaded(true)

            return true
          })
          .catch(() => {
            router.push("/500")
          })
      }
    }
  }, [q, router])

  return (
    <>
      <NextSeo
        title="Clan Search"
        description="Search for clans on CWStats."
        openGraph={{
          title: "Clan Search",
          description: "Search for clans on CWStats.",
        }}
      />

      <Header>Clan Search</Header>

      <SearchBarDiv>
        <SearchBar defaultValue={q} placeholder="Name or tag, e.g. 9U82JJ0Y" />
      </SearchBarDiv>

      <HeaderDiv>
        <Text>
          Showing top {clans.length} search result(s). Search by tag if you
          cannot find clan by name, the clan will then be saved for future
          searches.
        </Text>
      </HeaderDiv>

      <SearchContent clans={clans} skeleton={!isLoaded} />
    </>
  )
}
