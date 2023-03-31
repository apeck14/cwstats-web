import styled from "styled-components"
import Spinner from "../components/Spinner"
import { gray } from "../public/static/colors"
import Head from "next/head"

const Main = styled.div({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexDirection: "column",
	marginTop: "5rem"
})

const Header = styled.h1({
	"color": gray["0"],
	"marginTop": "1.5rem",

	"@media (max-width: 480px)": {
		fontSize: "1.3rem",
	},
})

const SubHeader = styled.h2({
	"color": gray["25"],
	"marginTop": "0.5rem",

	"@media (max-width: 480px)": {
		fontSize: "1rem",
	},
})

export default function Matchmaking() {
	return (
		<>
			<Head>
				<title>Matchmaking...</title>
			</Head>
			<Main>
				<Spinner />
				<Header>Matchmaking in progress.</Header>
				<SubHeader>Check back soon.</SubHeader>
			</Main>
		</>

	)
}