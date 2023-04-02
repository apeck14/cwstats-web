import styled from "styled-components"
import { gray, pink } from "../../../public/static/colors.js"
import useWindowSize from "../../../hooks/useWindowSize.js"
import { diffInMins } from "../../../utils/date-time.js"
import Item from "./Item.js"
import { useEffect, useState } from "react"

const Container = styled.div({
	"background": gray["50"],
	// eslint-disable-next-line no-dupe-keys
	"background": "linear-gradient(0deg, #242526, #242526, #262728, #28292a, #2a2b2c, #2d2e2f, #303132, #333435, #363738, #38393a, #393a3b, #3a3b3c)",
	"color": gray["0"],
	"padding": "2rem",

	"@media (max-width: 750px)": {
		padding: "1.5rem 0.75rem",
	},
})

const Header = styled.h2({
	"fontFamily": "SansPro700",
	"fontSize": "3rem",
	"textAlign": "center",

	"@media (max-width: 750px)": {
		fontSize: "2.5rem",
	},

	"@media (max-width: 480px)": {
		fontSize: "1.8rem",
	},
})

const ContentDiv = styled.div({})

const LastUpdated = styled.p({
	"textAlign": "center",
	"margin": "1rem 0",

	"@media (max-width: 480px)": {
		fontSize: "0.8rem"
	},
})

export default function Leaderboard({ clans, lbLastUpdated }) {
	const { width } = useWindowSize()
	const [lastUpdated, setLastUpdated] = useState()

	useEffect(() => {
		setLastUpdated(diffInMins(lbLastUpdated))
	}, [lbLastUpdated])

	const isTablet = width < 750
	const isMobile = width < 450

	return (
		<Container>
			<Header>Daily Leaderboard</Header>
			<LastUpdated>
				Last Updated: <span style={{
					color: pink
				}}>{lastUpdated}m ago</span>
			</LastUpdated>
			<ContentDiv>
				{clans.map((c, index) => {
					return <Item key={index} index={index} clan={c} isMobile={isMobile} isTablet={isTablet} />
				})}
			</ContentDiv>
		</Container>
	)
}