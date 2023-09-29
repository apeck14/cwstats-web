import styled from "styled-components"

import { gray, orange } from "../../../../../public/static/colors"
import CheckmarkToggle from "./CheckmarkToggle"

const Main = styled.div`
  width: 100%;
`

const Item = styled.div`
  background-color: ${gray["75"]};
  color: ${gray["0"]};
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  cursor: pointer;
  align-items: center;

  &:hover {
    background-color: ${gray["100"]};
  }
`

const Hashtag = styled.span`
  color: ${orange};
  margin-right: 0.25rem;
  font-size: 1.1rem;
`

export default function ChannelList({ activeChannelIDs, allChannels, handleChange }) {
  return (
    <Main>
      {allChannels.slice(1).map((c) => (
        <Item key={c.id} onClick={() => handleChange(c, "Commands")}>
          <CheckmarkToggle isActive={activeChannelIDs.includes(c.id)} />
          <Hashtag>#</Hashtag>
          {c.name}
        </Item>
      ))}
    </Main>
  )
}
