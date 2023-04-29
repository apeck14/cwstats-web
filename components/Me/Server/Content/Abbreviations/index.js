import { useState } from "react"
import styled from "styled-components"

import { gray, pink } from "../../../../../public/static/colors"
import AddAbbr from "./AddAbbr"
import Item from "./Item"

const Header = styled.h2`
  color: ${gray["0"]};
`

const Remaining = styled.p`
  color: ${gray["0"]};
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 2rem;
`

const RemNum = styled.span`
  color: ${pink};
`

export default function Abbreviations({ data }) {
  const [abbreviations, setAbbreviations] = useState(data)

  const handleDelete = (abbr) => {
    // delete item from DB
    setAbbreviations(abbreviations.filter((a) => a.abbr !== abbr))
  }

  return (
    <>
      <Header>Abbreviations</Header>
      {abbreviations
        .sort((a, b) => a.abbr.localeCompare(b.abbr))
        .map((a, index) => (
          <Item abbr={a} index={index} handleDelete={handleDelete} />
        ))}
      <Remaining>
        You have <RemNum>{15 - abbreviations.length}</RemNum> abbreviations
        left.
      </Remaining>
      <AddAbbr data={abbreviations} />
    </>
  )
}
