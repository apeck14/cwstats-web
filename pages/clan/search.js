import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getClan, getClanSearchResults } from "../../utils/services"
import styled from "styled-components"
import { gray, orange, pink } from "../../public/static/colors"
import { BiSearchAlt } from "react-icons/bi"
import Image from "next/image"
import Link from "next/link"
import { levenshtein } from "string-comparison"
import { NextSeo } from "next-seo"

const Main = styled.div({
	"margin": "0 auto",
	"width": "70rem",

	"@media (max-width: 1200px)": {
		width: "80%"
	},

	"@media (max-width: 1024px)": {
		width: "100%"
	},
})

const SearchBarContainer = styled.div({
	"display": "flex",
	"alignItems": "center",
	"justifyContent": "center",
	"marginTop": "5rem",

	"@media (max-width: 480px)": {
		marginTop: "2rem"
	},
})

const SearchBar = styled.input({
	"padding": "0.8rem 1.5rem",
	"lineHeight": "1.4rem",
	"fontSize": "1rem",
	"borderTopLeftRadius": "1.5rem",
	"borderBottomLeftRadius": "1.5rem",
	"borderTopRightRadius": "0",
	"borderBottomRightRadius": "0",
	"color": gray["50"],
	"fontFamily": "SansPro600",

	"@media (max-width: 380px)": {
		padding: "0.8rem 1.1rem",
		fontSize: "0.9rem",
		lineHeight: "1.3rem",
	},

	"@media (max-width: 450px)": {
		"::placeholder": {
			fontSize: "0.9rem"
		},
	},

})

const SearchButton = styled.button({
	"display": "inline-flex",
	"justifyContent": "center",
	"alignItems": "center",
	"backgroundColor": pink,
	"border": "none",
	"padding": "0.8rem 1.5rem",
	"borderTopRightRadius": "1.5rem",
	"borderBottomRightRadius": "1.5rem",

	"&:hover, &:active": {
		cursor: "pointer",
		backgroundColor: orange,
	},

	"@media (max-width: 380px)": {
		padding: "0.8rem 1.1rem",
	},
})

const SearchIcon = styled(BiSearchAlt)({
	"color": gray["0"],
	"fontSize": "1.4rem",

	"@media (max-width: 380px)": {
		fontSize: "1.3rem",
	},
})

const HeaderDiv = styled.div({
	backgroundColor: gray["75"],
	padding: "1rem",
	marginTop: "2rem",
	borderBottom: `2px solid ${orange}`
})

const Content = styled.div({
	backgroundColor: gray["75"],
	minHeight: "20rem",
	padding: "1rem",
	marginBottom: "1rem"
})

const Text = styled.p({
	"color": gray["0"],

	"@media (max-width: 480px)": {
		fontSize: "0.8rem"
	},
})

const Item = styled.div({
	backgroundColor: gray['50'],
	borderRadius: "0.25rem",
	padding: "1rem",
	display: "flex",
	marginBottom: "0.25rem"
})

const Badge = styled(Image)({})

const InfoDiv = styled.div({
	marginLeft: "1rem",
})

const Name = styled(Link)({
	"textDecoration": "none",
	"color": gray["0"],

	":hover, :active": {
		color: pink
	}
})

const Tag = styled.p({
	color: gray["25"]

})

const NoClans = styled.p({
	color: gray["25"],
	fontStyle: "italic"
})

export default function ClanSearch () {
	const router = useRouter()
	const [clans, setClans] = useState([])
	const [clanSearch, setClanSearch] = useState("")
	const { q } = router.query

	useEffect(() => {
		if (q) {
			const trimmedQuery = q.trim()

			if (trimmedQuery.length > 0 && router) {
				getClanSearchResults(trimmedQuery)
					.then((data) => {
						const sorted = levenshtein
							.sortMatch(trimmedQuery, data.map(c => c.name))
							.sort((a, b) => b.rating - a.rating)
							.map(c => data.find(cl => cl.name === c.member))

						setClans(sorted)

						return true
					})
					.catch(() => {
						router.push('/500')
					})
			}
		}

	}, [q, router])

	const handleClanSearchChange = e => {
		setClanSearch(e.target.value)
	}

	const handleClanSubmit = async () => {
		const trimmedClanSearch = clanSearch.trim()

		if (trimmedClanSearch.length > 0) {
			const tagRegex = /^[A-Za-z0-9#]+$/
			const meetsTagReq = trimmedClanSearch.length >= 5 && trimmedClanSearch.length <= 9 && trimmedClanSearch.match(tagRegex)

			if (meetsTagReq) {
				try {
					const res = await getClan(trimmedClanSearch)
					const data = await res.json()

					router.push(`/clan/${data.tag.substring(1)}`)
				}
				catch {
					router.push({
						pathname: '/clan/search',
						query: {
							q: trimmedClanSearch
						}
					})
				}

			}
			else {
				router.push({
					pathname: '/clan/search',
					query: {
						q: trimmedClanSearch
					}
				})
			}
		}
	}

	return <>
		<NextSeo
			title= "Clan Search"
			description= "Search for clans on CWStats."
			openGraph={{
				title: "Clan Search",
				description: "Search for clans on CWStats."
			}}
		/>
		<Main>
			<SearchBarContainer>
				<SearchBar defaultValue={q} onChange={handleClanSearchChange} placeholder="Name or tag, e.g. 9U82JJ0Y" />
				<SearchButton onClick={handleClanSubmit}>
					<SearchIcon />
				</SearchButton>
			</SearchBarContainer>

			<HeaderDiv>
				<Text>Showing top 50 search results. Search by tag if you cannot find clan by name.</Text>
			</HeaderDiv>

			<Content>
				{
					clans.length > 0 ? clans.map((c, index) => (
						<Item key={index}>
							<Badge src={`/assets/badges/${c.badge}.png`} width={28} height={38.5} alt="Badge" />
							<InfoDiv>
								<Name href={`/clan/${c.tag.substring(1)}`}>{c.name}</Name>
								<Tag>{c.tag}</Tag>
							</InfoDiv>
						</Item>
					)) : <NoClans>No clans found</NoClans>
				}
			</Content>

		</Main>
	</>

}