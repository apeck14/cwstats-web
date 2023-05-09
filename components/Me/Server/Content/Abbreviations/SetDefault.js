import { useState } from "react"
import { FaTrashAlt } from "react-icons/fa"
import styled from "styled-components"

import {
  errorRed,
  gray,
  orange,
  pink,
} from "../../../../../public/static/colors"
import { formatTag } from "../../../../../utils/functions"
import {
  removeDefaultClan,
  setDefaultClan,
} from "../../../../../utils/services"
import LoadingSpinner from "../../../../LoadingSpinner"

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ClanDiv = styled.div`
  background-color: ${({ isClanSet }) => (isClanSet ? gray["50"] : null)};
  width: 15rem;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  gap: 1rem;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
  outline: ${({ isClanSet }) =>
    isClanSet ? null : `2px dashed ${gray["50"]}`};
  box-shadow: ${({ isClanSet }) =>
    isClanSet ? "rgba(0, 0, 0, 0.24) 0px 3px 8px" : null};
`

const Name = styled.p`
  color: ${gray["0"]};
  font-weight: 600;
`

const Tag = styled(Name)`
  color: ${gray["25"]};
`

const None = styled(Tag)`
  font-style: italic;
`

const Form = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`

const TagInput = styled.input`
  border-radius: 0.25rem;
  width: 6rem;
  padding: 0.5rem;
  background-color: ${gray["100"]};
  color: ${gray["0"]};
  font-weight: 600;
  font-size: 1rem;
`

const Set = styled.button`
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

const Delete = styled(FaTrashAlt)`
  color: ${orange};
  font-size: 1.25rem;

  :hover,
  :active {
    color: ${pink};
    cursor: pointer;
  }
`

export default function SetDefault({ defaultClan, serverId }) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tag, setTag] = useState("")
  const [clan, setClan] = useState(defaultClan)

  const handleSet = () => {
    setIsLoading(true)

    if (tag.length === 0) {
      setError("No tag set.")
      setIsLoading(false)
      return
    }

    setDefaultClan(tag, serverId).then(async (res) => {
      const { success, name, message } = await res.json()

      if (success) {
        setClan({ name, tag: formatTag(tag, true) })
        setError(null)
        setTag("")
      } else {
        setError(message)
      }

      setIsLoading(false)
    })
  }

  const handleChange = (e) => {
    setTag(e.target.value)
  }

  const handleDelete = () => {
    setClan(null)

    removeDefaultClan(serverId)
  }

  return (
    <>
      <Container>
        <ClanDiv isClanSet={!!clan}>
          {clan ? (
            <>
              <Name>{clan.name}</Name>
              <Tag>{clan.tag}</Tag>
            </>
          ) : (
            <None>None</None>
          )}
        </ClanDiv>

        {clan && <Delete onClick={handleDelete} />}
      </Container>

      <Form>
        <TagInput
          placeholder="#CLANTAG"
          onChange={handleChange}
          value={tag}
          maxLength={9}
        />
        <Set onClick={handleSet}>
          {isLoading ? <LoadingSpinner size="0.75rem" lineWidth={2} /> : "Set"}
        </Set>
        <Error>{error}</Error>
      </Form>
    </>
  )
}
