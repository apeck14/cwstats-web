import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import { gray, pink } from "../../../../../public/static/colors"
import { removeAbbreviation } from "../../../../../utils/services"
import Hr from "../../../../Hr"
import AddAbbr from "./AddAbbr"
import Item from "./Item"
import SetDefault from "./SetDefault"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`

const None = styled.p`
  color: ${gray["25"]};
  font-style: italic;
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

export default function Abbreviations({ abbrList, defaultClan }) {
  const router = useRouter()
  const [abbreviations, setAbbreviations] = useState(abbrList)

  const { serverId } = router.query

  const handleDelete = (abbr) => {
    setAbbreviations(abbreviations.filter((a) => a.abbr !== abbr))

    removeAbbreviation(serverId, abbr)
  }

  return (
    <>
      <Header>Default Clan</Header>
      <SetDefault defaultClan={defaultClan} serverId={serverId} />

      <Hr color={gray["50"]} margin="1.5rem 0" />

      <Header>Abbreviations</Header>
      {abbreviations.length === 0 ? (
        <None>No abbreviations set!</None>
      ) : (
        abbreviations
          .sort((a, b) => a.abbr.localeCompare(b.abbr))
          .map((a, index) => <Item abbr={a} handleDelete={handleDelete} index={index} key={a.abbr} />)
      )}
      <Remaining>
        You have <RemNum>{15 - abbreviations.length}</RemNum> abbreviations left.
      </Remaining>
      <AddAbbr abbreviations={abbreviations} serverId={serverId} setAbbreviations={setAbbreviations} />
    </>
  )
}
