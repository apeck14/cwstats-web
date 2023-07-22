import { useRouter } from "next/router"
import { CgLoadbarDoc } from "react-icons/cg"
import { IoPodiumOutline } from "react-icons/io5"
import { TbBrandDiscord, TbSpy } from "react-icons/tb"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"
import {
  DAILY_LEADERBOARD_NAV_DESC,
  DISCORD_BOT_INVITE_LINK,
  INVITE_BOT_NAV_DESC,
  JOIN_SUPPORT_SERVER_NAV_DESC,
  SUPPORT_SERVER_INVITE_LINK,
  WAR_LEADERBOARD_NAV_DESC,
} from "../../utils/constants"

const SlideMenu = styled.nav`
  position: fixed;
  height: 100%;
  width: 80vw;
  top: 4rem;
  right: 0;
  background-color: ${gray["75"]};
  padding: 1rem;
  display: flex;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  flex-direction: column;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: 0.2s ease-out;

  h3:nth-of-type(2),
  h3:nth-of-type(3) {
    margin-top: 0.75rem;
  }

  h3:nth-of-type(3) {
    margin-bottom: 0.75rem;
  }
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

const SpyIcon = styled(TbSpy)`
  color: ${pink};
  font-size: 1.25rem;
`

const Item = styled.div`
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 0.25rem;

  :hover,
  :active {
    background-color: ${gray["50"]};
  }
`

const ItemTitle = styled.h4`
  color: ${gray["0"]};
  font-size: 1.1rem;
`

const Description = styled.p`
  color: ${gray["25"]};
  font-size: 0.9rem;
`

export default function MobileMenu({ isOpen, setIsOpen }) {
  const router = useRouter()

  const handleClick = (url) => {
    setIsOpen(false)
    router.push(url)
  }

  return (
    <SlideMenu isOpen={isOpen}>
      <Title>
        <LeaderboardIcon />
        Leaderboards
      </Title>
      <Item onClick={() => handleClick("/leaderboard/daily/global")}>
        <ItemTitle>Daily</ItemTitle>
        <Description>{DAILY_LEADERBOARD_NAV_DESC}</Description>
      </Item>
      <Item onClick={() => handleClick("/leaderboard/war/global")}>
        <ItemTitle>War</ItemTitle>
        <Description>{WAR_LEADERBOARD_NAV_DESC}</Description>
      </Item>
      <Title onClick={() => handleClick("/spy")}>
        <SpyIcon />
        Spy
      </Title>
      <Title onClick={() => handleClick("/docs")}>
        <DocIcon />
        Docs
      </Title>
      <Title>
        <DiscordIcon />
        Invite
      </Title>
      <Item onClick={() => handleClick(DISCORD_BOT_INVITE_LINK)}>
        <ItemTitle>Add To Server</ItemTitle>
        <Description>{INVITE_BOT_NAV_DESC}</Description>
      </Item>
      <Item onClick={() => handleClick(SUPPORT_SERVER_INVITE_LINK)}>
        <ItemTitle>Support Server</ItemTitle>
        <Description>{JOIN_SUPPORT_SERVER_NAV_DESC}</Description>
      </Item>
    </SlideMenu>
  )
}
