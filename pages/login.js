import styled from "styled-components"
import { gray, orange, pink } from "../public/static/colors"
import { signIn } from "next-auth/react"
import { FaDiscord } from "react-icons/fa"
import Head from "next/head"

const Main = styled.div({
	margin: "auto",
	maxWidth: "90%",
	fontFamily: "SansPro600",
	textAlign: "center",
})

const Header = styled.h1({
	color: gray["0"]
})

const SubHeader = styled.h2({
	color: gray["25"],
	fontSize: "1rem",
	fontWeight: 500,
	marginTop: "0.5rem"
})

const LoginBtn = styled.button({
	"display": "flex",
	"alignItems": "center",
	"margin": "0 auto",
	"marginTop": "1rem",
	"borderRadius": "1rem",
	"borderWidth": "0",
	"backgroundColor": pink,
	"color": gray["0"],
	"padding": "0.5rem 1rem",
	"fontWeight": 500,
	"fontFamily": "inherit",

	":hover, :active": {
		cursor: "pointer",
		backgroundColor: orange
	}
})

const DiscordIcon = styled(FaDiscord)({
	fontSize: "1rem",
	paddingRight: "0.4rem"
})

export default function Login() {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Main>
				<Header>You are not logged in.</Header>
				<SubHeader>To access the full site, please login with Discord.</SubHeader>
				<LoginBtn onClick={() => signIn("discord", {
					callbackUrl: "/"
				})}><DiscordIcon />Log In</LoginBtn>
			</Main>
		</>

	)
}