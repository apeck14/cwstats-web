import { BiSolidCrown } from "react-icons/bi"
import styled from "styled-components"

import { gray, orange, pink } from "../../public/static/colors"

const Main = styled.div``

const Premium = styled.h1`
  font-size: 1.75rem;
  color: ${gray["0"]};
  border-color: ${orange};
  border-width: 3px;
  border-style: solid;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  width: fit-content;
  margin: 3rem auto 2rem auto;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
    border-width: 2px;
  }
`

const CrownIcon = styled(BiSolidCrown)`
  color: ${pink};
  font-size: 2.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const Header = styled.h1`
  color: ${gray["0"]};
  font-size: 3.25rem;
  text-align: center;
`

const Orange = styled.span`
  color: ${orange};
`

const List = styled.ol`
  color: ${gray["0"]};
  font-size: 1.3rem;
  font-weight: 500;
`

const Item = styled.li`
  &::marker {
    color: ${orange};
  }
`

export default function Plus() {
  return (
    <Main>
      <Premium>
        <CrownIcon />
        UPGRADE
      </Premium>
      <Header>
        Activate <Orange>CWStats+</Orange>
      </Header>
      <List>
        <Item>Add &quot;CWStats.com&quot; to your clan&apos;s description in-game.</Item>
        <Item>Enter your clan&apos;s tag below.</Item>
        <Item>Click &quot;+&quot;.</Item>
        <Item>Enjoy your newly unlocked features. 🎉</Item>
      </List>
    </Main>
  )
}
