import styled from "styled-components"

import { gray } from "../../../../../public/static/colors"
import Item from "./Item"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-bottom: 0.5rem;
`

const ItemsDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`

export default function Channels({ allChannels, setChannels }) {
  const {
    applicationsChannelID,
    applyChannelID,
    commandChannelIDs,
    warReportChannelID,
  } = setChannels

  allChannels.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <Header>Channels</Header>
      <ItemsDiv>
        <Item
          name="Applications"
          channels={allChannels.filter((c) => c.id === applicationsChannelID)}
          allChannels={allChannels}
        />
        <Item
          name="Apply"
          channels={allChannels.filter((c) => c.id === applyChannelID)}
          allChannels={allChannels}
        />
        <Item
          name="War Report"
          channels={allChannels.filter((c) => c.id === warReportChannelID)}
          allChannels={allChannels}
        />
        <Item
          name="Commands"
          channels={allChannels.filter((c) =>
            commandChannelIDs?.includes(c.id)
          )}
          allChannels={allChannels}
        />
      </ItemsDiv>
    </>
  )
}
