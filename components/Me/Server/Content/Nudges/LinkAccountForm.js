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

  ::placeholder {
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

  :hover,
  :active {
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
      serverId: router.query.serverId,
      tag,
      discordID: clickedUser.id,
    })

    const { success, name, message: errMessage } = await resp.json()

    if (success) {
      setAccounts([
        ...accounts,
        { name, discordID: clickedUser.id, tag: formatTag(tag, true) },
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
        setError={setError}
        query={query}
        setQuery={setQuery}
        setClickedUser={setClickedUser}
      />
      <TagInput
        onChange={handleTagChange}
        value={tag}
        placeholder="#PLAYERTAG"
        maxLength={10}
      />
      <Add onClick={handleSubmit}>
        {isLoading ? <LoadingSpinner size="0.75rem" lineWidth={2} /> : "Add"}
      </Add>
      <Error>{error}</Error>
    </FormContainer>
  )
}
