import { useRouter } from "next/navigation"
import { useState } from "react"
import styled from "styled-components"

import { gray, orange } from "../../public/static/colors"
import {
  DAILY_LEADERBOARD_NAV_DESC,
  DISCORD_BOT_INVITE_LINK,
  INVITE_BOT_NAV_DESC,
  JOIN_SUPPORT_SERVER_NAV_DESC,
  WAR_LEADERBOARD_NAV_DESC,
} from "../../utils/constants"

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Header = styled.div`
  color: ${gray["0"]};
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${({ isActive }) => isActive && gray["50"]};
  position: relative;
  transition: 0.5s ease-out;

  :hover {
    background-color: ${gray["50"]};
    cursor: pointer;
  }
`

const Menu = styled.div`
  width: 15rem;
  background-color: ${gray["75"]};
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
  border-radius: 0 0 0.25rem 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 0.5rem;
  border-top: 2px solid ${orange};
`

const Item = styled.div`
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: 0.2s ease-out;

  :hover {
    background-color: ${gray["50"]};
    cursor: pointer;
  }
`

const Title = styled.h4`
  color: ${gray["0"]};
  font-size: 1.2rem;
`

const Description = styled.p`
  color: ${gray["25"]};
  font-size: 0.75rem;
  font-weight: 700;
`

export default function NavItem({ children, isActive, type }) {
  const router = useRouter()
  const [showSubMenu, setShowSubMenu] = useState(false)

  const handleHeaderClick = () => {
    if (type === "invite" || type === "leaderboards") return

    router.push("/docs")
  }

  const handleClick = (url) => {
    setShowSubMenu(false)
    router.push(url)
  }

  return (
    <Container
      onMouseEnter={() => setShowSubMenu(true)}
      onMouseLeave={() => setShowSubMenu(false)}
    >
      <Header onClick={handleHeaderClick} isActive={isActive}>
        {children}
      </Header>
      {showSubMenu && type === "leaderboards" && (
        <Menu
          onMouseEnter={() => setShowSubMenu(true)}
          onMouseLeave={() => setShowSubMenu(false)}
        >
          <Item onClick={() => handleClick("/leaderboard/daily/global")}>
            <Title>Daily</Title>
            <Description>{DAILY_LEADERBOARD_NAV_DESC}</Description>
          </Item>
          <Item onClick={() => handleClick("/leaderboard/war/global")}>
            <Title>War</Title>
            <Description>{WAR_LEADERBOARD_NAV_DESC}</Description>
          </Item>
        </Menu>
      )}
      {showSubMenu && type === "invite" && (
        <Menu>
          <Item onClick={() => handleClick(DISCORD_BOT_INVITE_LINK)}>
            <Title>Add To Server</Title>
            <Description>{INVITE_BOT_NAV_DESC}</Description>
          </Item>
          <Item onClick={() => handleClick("/server/invite")}>
            <Title>Support Server</Title>
            <Description>{JOIN_SUPPORT_SERVER_NAV_DESC}</Description>
          </Item>
        </Menu>
      )}
    </Container>
  )
}
