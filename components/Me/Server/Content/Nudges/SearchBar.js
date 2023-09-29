import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import useDebouncedCallback from "../../../../../hooks/useDebouncedCallback"
import { gray } from "../../../../../public/static/colors"
import { searchGuildMembers } from "../../../../../utils/services"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const Input = styled.input`
  border-radius: 0.25rem;
  width: 15rem;
  padding: 0.5rem;
  background-color: ${gray["100"]};
  color: ${gray["0"]};
  font-weight: 600;
  font-size: 1rem;

  &::placeholder {
    color: ${gray["50"]};
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    width: 8rem;
  }
`

const Results = styled.div`
  position: absolute;
  top: 40px;
  width: 15rem;
  padding: 0.5rem;
  background: ${gray["50"]};
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 2;

  @media (max-width: 480px) {
    width: 8rem;
  }
`

const Item = styled.div`
  font-weight: 600;
  padding: 0.25rem;
  display: flex;
  column-gap: 0.5rem;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background-color: ${gray["75"]};
  }
`

const DisplayName = styled.p`
  color: ${gray["0"]};
`

const Username = styled.p`
  color: ${gray["25"]};
`

export default function SearchBar({ query, setClickedUser, setError, setQuery }) {
  const router = useRouter()
  const [results, setResults] = useState([])

  const updateSearchResults = useDebouncedCallback(async (search) => {
    if (search) {
      const resp = await searchGuildMembers({
        query: search,
        serverId: router.query.serverId,
      })
      const data = await resp.json()

      if (resp.ok) {
        setResults(data)
        setError(null)
      } else {
        setError(data.message)
      }
    } else {
      setResults([])
    }
  }, 1000)

  const handleChange = (e) => {
    setQuery(e.target.value)
    updateSearchResults(e.target.value)
  }

  const handleClick = (user) => {
    setClickedUser(user)
    setQuery(`@${user.username} (${user.id})`)
    setResults([])
  }

  return (
    <Container>
      <Input onChange={handleChange} placeholder="Search Members..." value={query} />
      {results.length > 0 && (
        <Results>
          {results.map((result) => (
            <Item key={result.id} onClick={() => handleClick(result)}>
              <DisplayName>{result.global_name}</DisplayName>
              <Username>@{result.username}</Username>
            </Item>
          ))}
        </Results>
      )}
    </Container>
  )
}
