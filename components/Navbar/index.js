import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import { useState } from "react"
import { BiSearchAlt, BiSolidCrown } from "react-icons/bi"
import { CgLoadbarDoc } from "react-icons/cg"
import { FaDiscord } from "react-icons/fa"
import { IoPodiumOutline } from "react-icons/io5"
import { TbBrandDiscord, TbSpy } from "react-icons/tb"
import styled from "styled-components"

import useToggleBodyScroll from "../../hooks/useToggleBodyScroll"
import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange, pink } from "../../public/static/colors"
import HamburgerMenu from "./HamburgerMenu"
import MobileMenu from "./MobileMenu"
import NavItem from "./NavItem"
import SearchDropdown from "./SearchDropdown"

const mainBreakpoint = 840

const Nav = styled.nav`
  background-color: ${gray["75"]};
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  -webkit-tap-highlight-color: transparent;
`

const Section = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1rem;
  padding: 0 1rem;

  @media (max-width: 480px) {
    column-gap: 0.5rem;
  }
`

const MenuOptions = styled.div`
  display: flex;
  column-gap: 1rem;
  margin-left: 1rem;
  height: 100%;
`

const Title = styled.h1`
  color: ${gray["0"]};
  text-decoration: none;
  font-size: 1.6rem;
  font-weight: 700;
  margin-left: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const Logo = styled(Image)``

const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`

const SearchIcon = styled(BiSearchAlt)`
  font-size: 1.5rem;
  color: ${gray["25"]};
  transition: 0.3s;

  &:hover {
    color: ${pink};
    cursor: pointer;
  }
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

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 2.4rem;
  width: 2.5rem;
  border-width: 0;
  background-color: ${pink};
  color: ${gray["0"]};

  &:hover {
    cursor: pointer;
    background-color: ${orange};
  }

  @media (max-width: 480px) {
    height: 2.2rem;
    width: 2.3rem;
  }
`

const ProfilePicture = styled(Image)`
  border-radius: 50%;
  border-color: ${pink};
  border-width: 2px;
  border-style: solid;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    border-color: ${orange};
  }
`

const SpyIcon = styled(TbSpy)`
  color: ${pink};
  font-size: 1.25rem;
`

const CWStatsPlus = styled.button`
  font-weight: 700;
  color: ${gray["0"]};
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  height: 2rem;
  border-style: solid;
  border-width: 2px;
  border-color: ${orange};
  background-color: transparent;
  transition: 0.3s;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;

  &:hover {
    cursor: pointer;
    border-color: ${pink};
  }
`

const CrownIcon = styled(BiSolidCrown)`
  color: ${pink};
  font-size: 1.2rem;
`

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const { width } = useWindowSize()
  const { data: session } = useSession()
  const router = useRouter()

  useToggleBodyScroll(!showMenu)

  const profilePicSize = width < 365 ? 26 : 30
  const logoSize = 40

  return (
    <>
      <Nav className="noselect">
        <Section>
          <LinkWrapper href="/">
            <Logo alt="logo" height={logoSize} src="/assets/icons/logo.png" width={logoSize} />
            <Title>CWStats</Title>
          </LinkWrapper>
          {width >= mainBreakpoint && (
            <MenuOptions>
              <NavItem isActive={router.asPath.includes("/leaderboard")} type="leaderboards">
                <LeaderboardIcon />
                Leaderboards
              </NavItem>
              <NavItem isActive={router.asPath === "/spy"} url="/spy">
                <SpyIcon />
                Spy
              </NavItem>
              <NavItem isActive={router.asPath === "/docs"} url="/docs">
                <DocIcon />
                Docs
              </NavItem>
              <NavItem type="invite">
                <DiscordIcon />
                Invite
              </NavItem>
            </MenuOptions>
          )}
        </Section>

        <Section>
          <SearchIcon onClick={() => setShowSearch(!showSearch)} />
          {width >= mainBreakpoint && (
            <CWStatsPlus onClick={() => router.push("/upgrade")}>
              <CrownIcon />
              Upgrade
            </CWStatsPlus>
          )}
          {session ? (
            <ProfilePicture
              alt="Discord Profile"
              height={profilePicSize}
              onClick={() => router.push("/me")}
              src={session.user.image}
              width={profilePicSize}
            />
          ) : (
            <LoginButton onClick={() => signIn("discord")}>
              <FaDiscord size={24} />
            </LoginButton>
          )}
          {width < mainBreakpoint && <HamburgerMenu isOpen={showMenu} setIsOpen={setShowMenu} />}
          {showSearch && <SearchDropdown setShowSearch={setShowSearch} showSearch={showSearch} />}
        </Section>
      </Nav>

      <MobileMenu isOpen={showMenu} setIsOpen={setShowMenu} />
    </>
  )
}
