import styled from "styled-components"
import { gray, pink, red } from "../../public/static/colors"
import Image from "next/image"
import { useMemo, useState } from "react"
import { IoCaretDown, IoCaretUp } from "react-icons/io5"
import useWindowSize from "../../hooks/useWindowSize"
import { useRouter } from "next/router"

const Table = styled.table({
	width: "100%",
	borderCollapse: "collapse",
	margin: "1rem 0"
})

const TH = styled.th({
	"color": gray["25"],
	"borderBottom": `2px solid ${pink}`,
	"padding": "0.5rem 0.75rem",

	"@media (max-width: 768px)": {
		fontSize: "0.75rem"
	},

	"@media (max-width: 480px)": {
		padding: "0.25rem 0.4rem",
	},
})

const SortTh = styled(TH)({
	":hover, :active": {
		cursor: 'pointer',
		backgroundColor: gray["75"],
		borderTopLeftRadius: "0.4rem",
		borderTopRightRadius: "0.4rem"
	},
})

const Row = styled.tr({
	color: gray["0"],
})

const Cell = styled.td({
	"height": "2.5rem",
	"padding": "0 1rem",
	"backgroundColor": gray["75"],
	"fontFamily": "SansPro600",
	"borderTop": `1px solid ${gray["50"]}`,

	"@media (max-width: 1024px)": {
		padding: "0 0.5rem",
		fontSize: "0.8rem"
	},

	"@media (max-width: 480px)": {
		padding: "0 0.4rem",
		fontSize: "0.7rem",
		height: "2rem"
	},
})

const Name = styled.span({
	"fontSize": "1rem",

	":hover, :active": {
		cursor: 'pointer',
		color: pink
	},

	"@media (max-width: 480px)": {
		fontSize: "0.8rem"
	},
})

const CenterCell = styled(Cell)({
	textAlign: "center"
})

const DownArrow = styled(IoCaretDown)({
	float: "right"
})

const UpArrow = styled(IoCaretUp)({
	float: "right"
})

const ThIcon = styled(Image)({})

const sortFunctionsAscending = {
	name: (a, b) => {
		return b.name.localeCompare(a.name)
	},
	decksRemaining: (a, b) => {
		return a.decksUsedToday - b.decksUsedToday
	},
	totalDecks: (a, b) => {
		return a.decksUsed - b.decksUsed
	},
	boats: (a, b) => {
		return a.boatAttacks - b.boatAttacks
	},
	fame: (a, b) => {
		return a.fame - b.fame
	},
}

const sortFunctionsDescending = {
	name: (a, b) => {
		return a.name.localeCompare(b.name)
	},
	decksRemaining: (a, b) => {
		return b.decksUsedToday - a.decksUsedToday
	},
	totalDecks: (a, b) => {
		return b.decksUsed - a.decksUsed
	},
	boats: (a, b) => {
		return b.boatAttacks - a.boatAttacks
	},
	fame: (a, b) => {
		return b.fame - a.fame
	},
}

export default function RaceLeaderboard({ participants }) {
	const { width } = useWindowSize()
	const router = useRouter()
	const [sortConfig, setSortConfig] = useState({
		key: "fame",
		direction: "descending"
	})

	const toggleSort = (key) => {
		const isSameCol = key === sortConfig.key
		let direction

		if (isSameCol) {
			if (sortConfig.direction === "descending") direction = "ascending"
			else direction = "descending"
		}
		else direction = "descending"

		setSortConfig({
			key,
			direction
		})
	}

	const sortedItems = useMemo(() => {
		if (participants) {
			const sortableItems = [...participants]

			sortableItems.sort(
				sortConfig.direction === "ascending" ?
					sortFunctionsAscending[sortConfig.key] :
					sortFunctionsDescending[sortConfig.key]
			)

			return sortableItems
		}
		else return []
	}, [participants, sortConfig])

	const showArrow = (key) => {
		if (sortConfig.key === key) {
			if (sortConfig.direction === "descending") return <DownArrow />

			return <UpArrow />
		}

		return null
	}

	const isMobile = width <= 480

	return (
		<Table>
			<thead>
				<Row>
					<SortTh key="name" onClick={() => toggleSort("name")}>
						<span>Player</span>
						{ showArrow("name") }
					</SortTh>
					<SortTh key="decksRemaining" onClick={() => toggleSort("decksRemaining")}>
						<span>
							{
								isMobile ? <ThIcon src="/assets/icons/decksRemaining.png" width={12} height={12} /> : "Decks Used Today"
							}
						</span>
						{ showArrow("decksRemaining") }
					</SortTh>
					<SortTh key="totalDecks" onClick={() => toggleSort("totalDecks")}>
						<span>
							{
								isMobile ? <ThIcon src="/assets/icons/decks.png" width={12} height={12} /> : "Decks Used"
							}
						</span>
						{ showArrow("totalDecks") }
					</SortTh>
					<SortTh key="boats" onClick={() => toggleSort("boats")}>
						<span>
							{
								isMobile ? <ThIcon src="/assets/icons/boat-attack-points.png" width={13} height={12} /> : "Boat Attacks"
							}
						</span>
						{ showArrow("boats") }
					</SortTh>
					<SortTh key="fame" onClick={() => toggleSort("fame")}>
						<span>
							{
								isMobile ? <ThIcon src="/assets/icons/fame.png" width={9} height={12} /> : "Medals"
							}
						</span>
						{ showArrow("fame") }
					</SortTh>
				</Row>
			</thead>

			<tbody>
				{
					sortedItems.map((m, index) => (
						<Row key={index}>
							<Cell style={!m.inClan ? {
								backgroundColor: red
							} : null}>
								<Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>{m.name}</Name>
							</Cell>
							<CenterCell style={!m.inClan ? {
								backgroundColor: red
							} : null}>{m.decksUsedToday}</CenterCell>
							<CenterCell style={!m.inClan ? {
								backgroundColor: red
							} : null}>{m.decksUsed}</CenterCell>
							<CenterCell style={!m.inClan ? {
								backgroundColor: red
							} : null}>{m.boatAttacks}</CenterCell>
							<CenterCell style={!m.inClan ? {
								backgroundColor: red
							} : null}>{m.fame}</CenterCell>
						</Row>
					))
				}
			</tbody>
		</Table>
	)
}