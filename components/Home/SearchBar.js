import { useRouter } from "next/router"
import { useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange, pink } from "../../public/static/colors"
import { handleCRError } from "../../utils/functions"
import { getClan } from "../../utils/services"
import LoadingSpinner from "../LoadingSpinner"

const Main = styled.div`
  display: flex;
  align-items: center;
  height: 2.75rem;
`

const InputBar = styled.input`
  height: 100%;
  padding: 0 1.5rem;
  font-size: 1rem;
  border-radius: 1.5rem 0 0 1.5rem;
  color: ${gray["50"]};
  font-weight: 700;

  ::placeholder {
    font-size: 0.8rem;
  }
`

const Submit = styled.button`
  height: 100%;
  background-color: ${pink};
  padding: 0 1.5rem;
  border-radius: 0 1.5rem 1.5rem 0;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }

  @media (max-width: 380px) {
    padding: 0 1.25rem;
  }
`

const Icon = styled(BiSearchAlt)`
  color: ${gray["0"]};
  font-size: 1.4rem;

  @media (max-width: 380px) {
    font-size: 1.3rem;
  }
`

export default function SearchBar({
  placeholder,
  isPlayerSearch,
  defaultValue,
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [showSpinner, setShowSpinner] = useState(false)
  const { width } = useWindowSize()

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmit = () => {
    if (isPlayerSearch) router.push("/player/search")
    else {
      const trimmedSearch = search.trim()

      if (trimmedSearch.length > 0) {
        if (defaultValue && defaultValue === trimmedSearch) return

        setShowSpinner(true)

        const tagRegex = /^[A-Za-z0-9#]+$/
        const meetsTagReq = !!(
          trimmedSearch.length >= 5 &&
          trimmedSearch.length <= 9 &&
          trimmedSearch.match(tagRegex)
        )

        if (meetsTagReq) {
          getClan(trimmedSearch)
            .then((data) => {
              router.push(`/clan/${data.tag.substring(1)}`)

              return true
            })
            .catch((err) => {
              if (err.status === 404) {
                router.push({
                  pathname: "/clan/search",
                  query: {
                    q: trimmedSearch,
                  },
                })
              } else handleCRError(err, router)
            })
        } else {
          router.push({
            pathname: "/clan/search",
            query: {
              q: trimmedSearch,
            },
          })
        }
      }
    }
  }

  return (
    <Main>
      <InputBar
        placeholder={placeholder}
        onChange={handleChange}
        defaultValue={defaultValue}
      />
      <Submit
        onClick={handleSubmit}
        aria-label={`${isPlayerSearch ? "Player" : "Clan"} Search`}
      >
        {showSpinner ? (
          <LoadingSpinner
            size={width <= 380 ? "1.3rem" : "1.4rem"}
            lineWidth={3}
          />
        ) : (
          <Icon />
        )}
      </Submit>
    </Main>
  )
}
