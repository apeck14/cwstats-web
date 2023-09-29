import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import { errorRed, gray, orange, pink } from "../../../../../public/static/colors"
import { formatTag } from "../../../../../utils/functions"
import { addLinkedAccount } from "../../../../../utils/services"
import LoadingSpinner from "../../../../LoadingSpinner"
import SearchBar from "./SearchBar"

const FormContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`

const TagInput = styled.input`
  border-radius: 0.25rem;
  width: 5.75rem;
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

export default function LinkAccountForm({ accounts, setAccounts }) {
  const router = useRouter()
  const [tag, setTag] = useState("")
  const [error, setError] = useState(null)
  const [clickedUser, setClickedUser] = useState({})
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTagChange = (e) => {
    setTag(e.target.value)
  }

  const validateForm = () => {
    if (Object.keys(clickedUser).length === 0) {
      setError("No user selected.")
      return false
    }

    if (!tag) {
      setError("No tag set.")
      return false
    }

    const validTag = tag.match(/^[A-Za-z0-9#]+$/)
    if (!validTag || tag.length < 5) {
      setError("Invalid tag format.")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    const resp = await addLinkedAccount({
      discordID: clickedUser.id,
      serverId: router.query.serverId,
      tag,
    })

    const { message: errMessage, name, success } = await resp.json()

    if (success) {
      setAccounts([
        ...accounts,
        { discordID: clickedUser.id, name, tag: formatTag(tag, true) },
      ])
      setError(null)
      setTag("")
      setClickedUser({})
      setQuery("")
    } else {
      setError(errMessage)
    }

    setIsLoading(false)
  }

  return (
    <FormContainer>
      <SearchBar
        query={query}
        setClickedUser={setClickedUser}
        setError={setError}
        setQuery={setQuery}
      />
      <TagInput
        maxLength={10}
        onChange={handleTagChange}
        placeholder="#PLAYERTAG"
        value={tag}
      />
      <Add onClick={handleSubmit}>
        {isLoading ? <LoadingSpinner lineWidth={2} size="0.75rem" /> : "Add"}
      </Add>
      <Error>{error}</Error>
    </FormContainer>
  )
}
