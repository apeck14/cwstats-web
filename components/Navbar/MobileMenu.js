import { CgLoadbarDoc } from "react-icons/cg"
import { IoPodiumOutline } from "react-icons/io5"
import { TbBrandDiscord } from "react-icons/tb"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"

const SlideMenu = styled.nav`
  position: fixed;
  height: 100%;
  width: 75vw;
  top: 4rem;
  right: 0;
  background-color: ${gray["75"]};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`

const Title = styled.h3`
  color: ${gray["0"]};
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  column-gap: 0.25rem;
  background-color: ${gray["50"]};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`

const DocIcon = styled(CgLoadbarDoc)`
  color: ${pink};
  font-size: 1.25rem;
`

const LeaderboardIcon = styled(IoPodiumOutline)`
  color: ${pink};
`

const DiscordIcon = styled(TbBrandDiscord)`
  color: ${pink};
  font-size: 1.25rem;
`

const Item = styled.div`
  padding: 0.25rem;
`

const ItemTitle = styled.h4`
  color: ${gray["0"]};
  font-size: 1.1rem;
`

const Description = styled.p`
  color: ${gray["25"]};
`

export default function MobileMenu({ isOpen, setIsOpen }) {
  return (
    <SlideMenu isOpen={isOpen}>
      <Title>
        <LeaderboardIcon />
        Leaderboards
      </Title>
      <Item>
        <ItemTitle>Daily</ItemTitle>
        <Description>Test</Description>
      </Item>
      <Item>
        <ItemTitle>Daily</ItemTitle>
        <Description>Test</Description>
      </Item>
      <Title>
        <DocIcon />
        Docs
      </Title>
      <Title>
        <DiscordIcon />
        Invite
      </Title>
    </SlideMenu>
  )
}
