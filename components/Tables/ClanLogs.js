// import { groupBy } from "lodash"
// import styled from "styled-components"
// import { gray, orange, pink } from "../../public/static/colors"
// import Image from "next/image"
// import { FaTrophy } from "react-icons/fa"

// const SeasonTable = styled.table({
// 	width: "100%",
// 	borderCollapse: "collapse",
// 	margin: "1rem 0",
// 	tableLayout: "fixed",
// })

// const TH = styled.th({
// 	"color": gray["25"],
// 	"borderBottom": `2px solid ${pink}`,
// 	"padding": "0.5rem 0.75rem",
// 	"textAlign": ({ align }) => align || "center",

// 	"@media (max-width: 480px)": {
// 		padding: "0.25rem 0.4rem",
// 		fontSize: "0.75rem"
// 	},
// })

// const Row = styled.tr({
// 	"color": gray["0"],
// 	"backgroundColor": ({ isHeader }) => isHeader ? "inherit" : gray["75"],

// 	":hover, :active": {
// 		backgroundColor: ({ isHeader }) => isHeader ? null : gray["100"],
// 		cursor: ({ isHeader }) => isHeader ? null : "pointer"
// 	}
// })

// const Cell = styled.td({
// 	"height": "2rem",
// 	"fontSize": "0.9rem",
// 	"padding": "0 0.75rem",
// 	"fontFamily": "SansPro600",
// 	"borderTop": `1px solid ${gray["50"]}`,
// 	"textAlign": ({ align }) => align || "left",

// 	"@media (max-width: 1024px)": {
// 		padding: "0 0.5rem",
// 		fontSize: "0.8rem"
// 	},

// 	"@media (max-width: 480px)": {
// 		padding: "0 0.4rem",
// 		fontSize: "0.7rem"
// 	},
// })

// const ThIcon = styled(Image)({})

// const Trophy = styled(FaTrophy)({})

// export default function ClanLogs({ clanTag, log }) {
// 	const groupedLogsBySeason = groupBy(log, "seasonId")

// 	console.log(groupedLogsBySeason)

// 	return (
// 		Object.keys(groupedLogsBySeason).reverse().map((sId) => {
// 			return (
// 				<SeasonTable key={sId}>
// 					<thead>
// 						<Row isHeader={true}>
// 							<TH align="left">Season {sId}</TH>
// 							<TH>
// 								<Trophy />
// 							</TH>
// 							<TH>
// 								<ThIcon src="/assets/icons/boat-movement.png" height={18} width={21} />
// 							</TH>
// 							<TH>
// 								<ThIcon src="/assets/icons/battle.png" height={18} width={18} />
// 							</TH>
// 							<TH align="right">
// 								<ThIcon src="/assets/icons/cw-trophy.png" height={18} width={18} />
// 							</TH>
// 						</Row>
// 					</thead>
// 					<tbody>
// 						{
// 							groupedLogsBySeason[sId].map((w, index) => {
// 								const clan = w.standings.find(c => c.clan.tag === clanTag)
// 								const trophyChange = `${clan.trophyChange < 0 ? "" : "+"}${clan.trophyChange}`

// 								return (
// 									<Row key={index}>
// 										<Cell>W{w.sectionIndex + 1}</Cell>
// 										<Cell align="center">{clan.rank}</Cell>
// 										<Cell align="center">{clan.clan.fame}</Cell>
// 										<Cell align="center">190.34</Cell>
// 										<Cell align="right">
// 											<span style={{
// 												color: gray["50"],
// 												marginRight: "0.25rem"
// 											}}>{trophyChange}</span>
// 											{clan.clan.clanScore}
// 										</Cell>
// 									</Row>
// 								)
// 							})
// 						}
// 					</tbody>
// 				</SeasonTable>
// 			)
// 		})

// 	)
// }