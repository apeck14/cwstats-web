import styled from "styled-components"
import { gray, pink } from "../../public/static/colors"
import { formatRole } from "../../utils/functions"
import Image from "next/image"
import { getArenaFileName } from "../../utils/files"
import { useMemo, useState } from "react"
import { IoCaretDown, IoCaretUp } from "react-icons/io5"
import useWindowSize from "../../hooks/useWindowSize"
import { useRouter } from "next/router"

const Table = styled.table({
	width: "100%",
	borderCollapse: "collapse",
	marginBottom: "1rem"
})

const TH = styled.th({
	"color": gray["25"],
	"borderBottom": `2px solid ${pink}`,
	"padding": "0.5rem 0.75rem",

	"@media (max-width: 480px)": {
		padding: "0.25rem 0.4rem",
		fontSize: "0.75rem"
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
	"height": "3.5rem",
	"padding": "0 0.75rem",
	"fontFamily": "SansPro600",
	"borderTop": `1px solid ${gray["50"]}`,

	"@media (max-width: 1024px)": {
		padding: "0 0.5rem",
		fontSize: "0.8rem"
	},

	"@media (max-width: 480px)": {
		padding: "0 0.4rem",
		fontSize: "0.7rem"
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

const Arena = styled(Image)({
	verticalAlign: "middle"
})

const DownArrow = styled(IoCaretDown)({
	float: "right"
})

const UpArrow = styled(IoCaretUp)({
	float: "right"
})

const ThIcon = styled(Image)({})

const MobileNameCell = styled(Cell)({})

const TopMobileDiv = styled.div({})

const BottomMobileDiv = styled.div({})

const roles = [
	"leader",
	"coLeader",
	"elder",
	"member"
]

const sortFunctionsAscending = {
	rank: (a, b) => {
		return b.rank - a.rank
	},
	trophies: (a, b) => {
		return a.trophies - b.trophies
	},
	name: (a, b) => {
		return b.name.localeCompare(a.name)
	},
	lastSeen: (a, b) => {
		return a.lastSeenDate - b.lastSeenDate
	},
	role: (a, b) => {
		return roles.indexOf(b.role) - roles.indexOf(a.role)
	},
	level: (a, b) => {
		return a.expLevel - b.expLevel
	},
}

const sortFunctionsDescending = {
	rank: (a, b) => {
		return a.rank - b.rank
	},
	trophies: (a, b) => {
		return b.trophies - a.trophies
	},
	name: (a, b) => {
		return a.name.localeCompare(b.name)
	},
	lastSeen: (a, b) => {
		return b.lastSeenDate - a.lastSeenDate
	},
	role: (a, b) => {
		return roles.indexOf(a.role) - roles.indexOf(b.role)
	},
	level: (a, b) => {
		return b.expLevel - a.expLevel
	},
}

export default function MembersTable({ members }) {
	const { width } = useWindowSize()
	const router = useRouter()
	const [sortConfig, setSortConfig] = useState({
		key: "rank",
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
		if (members) {
			const sortableItems = [...members]

			sortableItems.sort(
				sortConfig.direction === "ascending" ?
					sortFunctionsAscending[sortConfig.key] :
					sortFunctionsDescending[sortConfig.key]
			)

			return sortableItems
		}
		else return []
	}, [members, sortConfig])

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
					<SortTh key="rank" onClick={() => toggleSort("rank")}>
						<span>#</span>
						{ showArrow("rank") }
					</SortTh>
					<TH></TH>
					<SortTh key="trophies" onClick={() => toggleSort("trophies")}>
						<span>{ isMobile ? <ThIcon src="/assets/icons/trophy.png" width={12} height={12} /> : 'Trophies'}</span>
						{ showArrow("trophies") }
					</SortTh>
					<SortTh key="name" onClick={() => toggleSort("name")}>
						<span>Name</span>
						{ showArrow("name") }
					</SortTh>
					{
						isMobile ? null :
							<>
								<SortTh key="lastSeen" onClick={() => toggleSort("lastSeen")}>
									<span>Last Seen</span>
									{ showArrow("lastSeen") }
								</SortTh>
								<SortTh key="role" onClick={() => toggleSort("role")}>
									<span>Role</span>
									{ showArrow("role") }
								</SortTh>
							</>
					}
					<SortTh key="level" onClick={() => toggleSort("level")}>
						<span>{ isMobile ? <ThIcon src="/assets/icons/level.png" width={12} height={12} /> : 'Level'}</span>
						{ showArrow("level") }
					</SortTh>
				</Row>
			</thead>

			<tbody>
				{
					sortedItems.map((m, index) => {
						const backgroundColor = index % 2 === 0 ? "#2e2f30" : gray["75"]

						return (
							<Row key={index}>
								<CenterCell style={{
									backgroundColor
								}}>{m.rank}</CenterCell>
								<CenterCell style={{
									backgroundColor
								}}>
									<Arena src={`/assets/arenas/${getArenaFileName(m.trophies)}.png`} height={32} width={32} alt="Arena" />
								</CenterCell>
								<CenterCell style={{
									backgroundColor
								}}>{m.trophies}</CenterCell>
								{
									isMobile ?
										<MobileNameCell style={{
											backgroundColor
										}}>
											<TopMobileDiv>
												<Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>{m.name}</Name>
											</TopMobileDiv>
											<BottomMobileDiv>
												<span style={{
													marginRight: "0.25rem",
													color: gray["25"]
												}}>{formatRole(m.role)}</span>
												<span style={{
													color: gray["25"]
												}}>{m.lastSeenStr}</span>
											</BottomMobileDiv>
										</MobileNameCell> :
										<>
											<Cell style={{
												backgroundColor
											}}>
												<Name onClick={() => router.push(`/player/${m.tag.substring(1)}`)}>{m.name}</Name>
											</Cell>
											<CenterCell style={{
												color: gray["25"],
												backgroundColor
											}}>{m.lastSeenStr}</CenterCell>
											<CenterCell style={{
												color: gray["25"],
												backgroundColor
											}}>{formatRole(m.role)}</CenterCell>
										</>
								}
								<CenterCell style={{
									color: gray["25"],
									backgroundColor
								}}>{m.expLevel}</CenterCell>
							</Row>
						)
					})
				}
			</tbody>
		</Table>
	)
}