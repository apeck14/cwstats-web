import Link from "next/link"
import styled from "styled-components"
import { BiMenu, BiSearchAlt, BiTrophy } from "react-icons/bi"
import { TbBrandDiscord } from "react-icons/tb"
import { IoPodiumOutline } from "react-icons/io5"
import { FaDiscord } from "react-icons/fa"
import { pink, gray, orange } from "../../public/static/colors.js"
import Dropdown from "./Dropdown"
import useWindowSize from "../../hooks/useWindowSize"
import { useState } from "react"
import MainMenu from "./MainMenu"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import SearchDropdown from "./SearchDropdown.js"

const mainBreakpoint = 840

const Nav = styled.nav({
	"backgroundColor": gray["75"],
	"width": "100%",
	"height": "4.4rem",
	"display": "inline-flex",
	"justifyContent": "space-between",
	"alignItems": "center",
	"color": gray["25"],

	"& > div:last-of-type": {
		justifyContent: "flex-end",
	},
})

const TitleText = styled(Link)({
	"color": gray["0"],
	"textDecoration": "none",
	"fontFamily": "SansPro700",
	"fontSize": "1.6rem",

	"@media (max-width: 365px)": {
		fontSize: "1.4rem",
	},
})

const Logo = styled(Image)({
	"padding": "0px 10px 0px 15px",

	"&:hover": {
		cursor: "pointer",
	},

	"@media (max-width: 365px)": {
		height: "2.5rem",
		width: "2.5rem",
		padding: "0px 5px 0px 10px",
	},
})

const EdgeItem = styled.div({
	display: "inline-flex",
	alignItems: "center",
	flex: 1,
	height: "100%",
})

const SearchIcon = styled(BiSearchAlt)({
	"fontSize": "1.5rem",
	"paddingRight": "15px",

	"&:hover, &:active": {
		color: pink,
		cursor: "pointer",
	},

	"@media (max-width: 365px)": {
		fontSize: "1.4rem",
		paddingRight: "8px",
	},
})

const MenuHeader = styled(Link)({
	"textDecoration": "none",
	"fontFamily": "SansPro700",
	"display": "inline-flex",
	"alignItems": "center",
	"fontSize": "1.1rem",
	"padding": "0px 20px",
	"height": "100%",
	"color": gray["0"],

	"&:hover": {
		color: pink,
		cursor: "pointer",
	},
})

const LoginButton = styled.button({
	"display": "flex",
	"alignItems": "center",
	"justifyContent": "center",
	"marginRight": "15px",
	"borderRadius": "50%",
	"height": "2.4rem",
	"width": "2.5rem",
	"fontFamily": "SansPro600",
	"borderWidth": "0",
	"backgroundColor": pink,
	"color": gray["0"],

	"&:hover, &:active": {
		cursor: "pointer",
		backgroundColor: orange,
	},

	"@media (max-width: 365px)": {
		marginRight: "8px",
		height: "2.2rem",
		width: "2.3rem",
	},
})

const ProfilePicture = styled(Image)({
	"borderRadius": "50%",
	"borderColor": pink,
	"borderWidth": "2px",
	"borderStyle": "solid",
	"marginRight": "15px",

	"&:hover, &:active": {
		cursor: "pointer",
		borderColor: orange
	},

	"@media (max-width: 365px)": {
		marginRight: "8px",
	},
})

const MainDiv = styled.div({
	height: "100%",
	display: "flex",
	alignItems: "center",
})

const MenuIcon = styled(BiMenu)({
	"fontSize": "2.5rem",
	"marginRight": "15px",

	"&:hover, &:active": {
		cursor: "pointer",
		filter: "brightness(85%)",
	},

	"@media (max-width: 365px)": {
		fontSize: "2.1rem",
		marginRight: "10px",
	},
})

export default function Navbar() {
	const [showMenu, setShowMenu] = useState(false)
	const [showSearch, setShowSearch] = useState(false)
	const { width } = useWindowSize()
	const { data: session } = useSession()
	const router = useRouter()

	const loginBtnSize = width < 365 ? 20 : 24
	const profilePicSize = width < 365 ? 26 : 30

	return (
		<>
			<Nav>
				<EdgeItem>
					<Logo className="noselect" src="/assets/icons/logo.png" alt="logo" height={46.4} width={46.4} />
					<TitleText className="noselect" href="/">
						CWStats
					</TitleText>
				</EdgeItem>

				{width >= mainBreakpoint ? (
					<MainDiv>
						<Dropdown
							header="Leaderboards"
							items={[
								{
									url: "/leaderboard/daily/global",
									title: "Daily "
								}, {
									url: "/leaderboard/war/global",
									title: "War"
								}
							]}
							icon={<IoPodiumOutline style={{
								marginRight: "5px",
								color: pink
							}} />}
						/>
						<MenuHeader href="/records"><BiTrophy style={{
							marginRight: "5px",
							color: pink
						}} />Records</MenuHeader>
						<Dropdown
							header="Discord Bot"
							icon={<TbBrandDiscord style={{
								marginRight: "5px",
								color: pink
							}} />}
							items={[
								{
									url: "/bot/setup",
									title: "Setup"
								},
								{
									url: "/bot/docs",
									title: "Docs"
								},
								{
									url: "/server/invite",
									title: "Support Server"
								}
							]}
						/>
					</MainDiv>
				) : null}

				<EdgeItem>
					<SearchIcon onClick={() => setShowSearch(!showSearch)} />
					{ session ?
						<ProfilePicture onClick={() => router.push('/me')} src={session.user.image} width={profilePicSize} height={profilePicSize} alt="Discord Profile" />:
						<LoginButton onClick={() => signIn("discord")}><FaDiscord size={loginBtnSize} /></LoginButton>
					}
					{width < mainBreakpoint ? <MenuIcon onClick={() => setShowMenu(!showMenu)} /> : null}
				</EdgeItem>
			</Nav>

			{showMenu && width < mainBreakpoint ? <MainMenu displayMenu={setShowMenu} /> : null}
			{showSearch ? <SearchDropdown showSearch={showSearch} setShowSearch={setShowSearch} /> : null}
		</>
	)
}