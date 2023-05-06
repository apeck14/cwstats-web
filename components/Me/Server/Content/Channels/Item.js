import { useState } from "react"
import styled from "styled-components"

import { gray } from "../../../../../public/static/colors"
import Dropdown from "./Dropdown"

const Main = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  align-items: center;
`

const Name = styled.h3`
  color: ${gray["25"]};
`

export default function Item({ name, channels, allChannels }) {
  const [isChannelSet, setIsChannelSet] = useState(!!channels.length)

  return (
    <Main>
      <Name>{name}:</Name>
      <Dropdown allChannels={allChannels}></Dropdown>
    </Main>
  )
}
