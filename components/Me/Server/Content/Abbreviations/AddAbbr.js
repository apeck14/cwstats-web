import { useState } from "react"
import styled from "styled-components"

import { errorRed, gray, orange, pink } from "../../../../../public/static/colors"
import { formatTag } from "../../../../../utils/functions"
import { addAbbreviation } from "../../../../../utils/services"
import LoadingSpinner from "../../../../LoadingSpinner"

const Main = styled.div`
  display: flex;
  margin-top: 1rem;
  height: 2rem;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const Abbr = styled.input`
  border-radius: 0.25rem;
  width: 4rem;
  padding: 0.5rem;
  background-color: ${gray["100"]};
  color: ${gray["0"]};
  font-weight: 600;
  font-size: 1rem;

  &::placeholder {
    color: ${gray["50"]};
    font-size: 0.9rem;
  }
`

const Tag = styled(Abbr)`
  width: 6rem;
`

const Add = styled.button`
  margin: 0 0.5rem;
  background-color: ${pink};
  color: ${gray["0"]};
  font-weight: 700;
  padding: 0.5rem 0;
  min-width: 3.5rem;
  border-radius: 0.25rem;

  &:hover {
    cursor: pointer;
    background-color: ${orange};
  }
`

const Error = styled.p`
  color: ${errorRed};
  font-weight: 600;
`

export default function AddAbbr({ abbreviations, setAbbreviations, serverId }) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [abbr, setAbbr] = useState("")
  const [tag, setTag] = useState("")

  const handleClick = () => {
    setIsLoading(true)

    if (abbr.length === 0) {
      setError("No abbreviation set.")
      setIsLoading(false)
      return
    }

    if (tag.length === 0) {
      setError("No tag set.")
      setIsLoading(false)
      return
    }

    addAbbreviation(serverId, abbr, tag).then(async (res) => {
      const { success, name, message } = await res.json()

      if (success) {
        setAbbreviations([...abbreviations, { name, abbr, tag: formatTag(tag, true) }])
        setError(null)
        setTag("")
        setAbbr("")
      } else {
        setError(message)
      }

      setIsLoading(false)
    })
  }

  const handleAbbrChange = (e) => {
    setAbbr(e.target.value)
  }

  const handleTagChange = (e) => {
    setTag(e.target.value)
  }

  return (
    <Main>
      <Abbr placeholder="abbr" maxLength={4} onChange={handleAbbrChange} value={abbr} />
      <Tag placeholder="#CLANTAG" maxLength={10} onChange={handleTagChange} value={tag} />
      <Add onClick={handleClick}>{isLoading ? <LoadingSpinner size="0.75rem" lineWidth={2} /> : "Add"}</Add>
      <Error>{error}</Error>
    </Main>
  )
}
