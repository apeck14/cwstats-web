import styled from "styled-components"

import { gray } from "../../../../../public/static/colors"
import ChannelList from "./ChannelList"
import DropdownMenuComponent from "./Dropdown"

const Main = styled.div`
  flex: 1;
  box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.2);
  margin-top: ${({ marginTop }) => marginTop || null};
`

const Title = styled.p`
  background-color: ${gray["100"]};
  text-align: center;
  padding: 0.5rem;
  font-weight: 700;
  color: ${gray["0"]};
  border-radius: 0.5rem 0.5rem 0 0;
  font-size: 1.2rem;
`

const Body = styled.div`
  background-color: ${gray["50"]};
  border-radius: 0 0 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`

const Description = styled.p`
  text-align: center;
  font-weight: 500;
  color: ${gray["25"]};
  font-size: 0.9rem;
`

export default function ChannelCard({
  title,
  description,
  initialChannelID,
  activeChannelIDs,
  allChannels,
  handleChange,
  marginTop,
}) {
  const isCommands = !!marginTop

  return (
    <Main marginTop={marginTop}>
      <Title>{title}</Title>
      <Body>
        <Description>{description}</Description>
        {isCommands ? (
          <ChannelList
            allChannels={allChannels}
            activeChannelIDs={activeChannelIDs}
            handleChange={handleChange}
          />
        ) : (
          <DropdownMenuComponent
            allChannels={allChannels}
            initialChannelID={initialChannelID}
            type={title}
            handleChange={handleChange}
          />
        )}
      </Body>
    </Main>
  )
}
