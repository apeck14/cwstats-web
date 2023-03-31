import styled from "styled-components"
import Spinner from "../components/Spinner"
import { gray } from "../public/static/colors"
import { NextSeo } from "next-seo"

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
			<NextSeo title="Matchmaking..." />
			<Main>
				<Spinner />
				<Header>Matchmaking in progress.</Header>
				<SubHeader>Check back soon.</SubHeader>
			</Main>
		</>

	)
}