import { BiTrophy } from "react-icons/bi"
import { IoPodiumOutline } from "react-icons/io5"
import { TbBrandDiscord } from "react-icons/tb"
import styled from "styled-components"
import { gray, pink } from "../../public/static/colors"
import { useRouter } from "next/router"

const Container = styled.ul({
	backgroundColor: gray["75"],
	flexWrap: "wrap",
	padding: "1rem",
})

const Header = styled.ul({
	color: gray["0"],
	fontFamily: "SansPro600",
	fontSize: "1.3rem",
	display: "inline-flex",
	alignItems: "center",
})

const Item = styled.li({
	listStyle: "none",
	fontFamily: "SansPro600",
	width: "fit-content",
	margin: "0.5rem 0"
})

const Line = styled.hr({
	borderTop: `1px ${gray["0"]}`,
	margin: "0.25rem 0 0 0"
})

const LinkItem = styled.p({
	"textDecoration": "none",
	"color": gray["0"],

	"&:hover, &:active": {
		color: pink,
		cursor: "pointer",
	},
})

export default function MainMenu({ displayMenu }) {
	const router = useRouter()

	const handleClick = (url) => {
		router.push(url)
		displayMenu(false)
	}

	return (
		<Container>
			<Header>
				<IoPodiumOutline style={{
					marginRight: "5px",
					color: pink
				}} />
				Leaderboards
			</Header>
			<Line />
			<Item>
				<LinkItem onClick={() => handleClick("/leaderboard/daily/global")}>
					Daily
				</LinkItem>
			</Item>
			<Item>
				<LinkItem onClick={() => handleClick("/leaderboard/war/global")}>
					War
				</LinkItem>
			</Item>
			<Header onClick={() => handleClick("/records")} style={{
				marginTop: "30px"
			}}>
				<BiTrophy style={{
					marginRight: "5px",
					color: pink
				}} />
				CW2 Records - Coming Soon!
			</Header>
			<br />
			<Header style={{
				marginTop: "30px"
			}}>
				<TbBrandDiscord style={{
					marginRight: "5px",
					color: pink
				}} />
				Discord Bot
			</Header>
			<Line />
			<Item>
				<LinkItem onClick={() => handleClick("/bot/setup")}>
					Setup
				</LinkItem>
			</Item>
			<Item>
				<LinkItem onClick={() => handleClick("/bot/docs")}>
					Docs
				</LinkItem>
			</Item>
			<Item>
				<LinkItem onClick={() => handleClick("/server/invite")}>
					Support Server
				</LinkItem>
			</Item>
		</Container>
	)
}