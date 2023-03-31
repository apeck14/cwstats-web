import { useEffect, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"
import { gray, orange, pink } from "../public/static/colors"
import useWindowSize from "../hooks/useWindowSize"
import Leaderboard from "../components/Home/Leaderboard/index.js"
import { useSession } from "next-auth/react"
import Link from "next/link"
import LoginOverlay from "../components/Home/Saved/LoginWithDiscordOverlay"
import { getClan, getDailyLeaderboard } from "../utils/services"
import { useRouter } from "next/router"
import { handleCRError } from "../utils/functions"
import { NextSeo } from "next-seo"

const TopContainer = styled.div({
	backgroundColor: gray["100"],
	maxWidth: "90%",
	margin: "0 auto",
	fontFamily: "SansPro600",
	padding: "4.5rem 1rem",
})

const TopHeader = styled.h1({
	"color": gray["0"],
	"fontFamily": "SansPro700",
	"fontSize": "3.5rem",
	"textAlign": "center",

	"@media (max-width: 480px)": {
		fontSize: "2.75rem",
	},

	"@media (max-width: 380px)": {
		fontSize: "2.5rem",
	},
})

const TopSubHeader = styled.p({
	"color": gray["25"],
	"textAlign": "center",
	"fontSize": "1.35rem",
	"marginTop": "25px",
	"padding": "0rem 2rem",

	"@media (max-width: 480px)": {
		fontSize: "1.3rem",
	},

	"@media (max-width: 380px)": {
		marginTop: "20px",
		fontSize: "1.25rem",
	},
})

const SearchContainer = styled.div({
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "center",
	marginTop: "50px",
})

const SearchDiv = styled.div({
	margin: "0 20px",
	textAlign: "center",
	padding: "0rem 1.8rem",
})

const SearchHeader = styled.p({
	"color": pink,
	"fontSize": "1.25rem",

	"@media (max-width: 420px)": {
		fontSize: "1.15rem",
	},
})

const SearchBarContainer = styled.div({
	marginTop: "10px",
	display: "flex",
	alignItems: "center",
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

const BottomContainer = styled.div({
	backgroundColor: gray["50"],
	display: 'flex',
	paddingBottom: "2rem",
	marginBottom: "2rem",
	justifyContent: "center"
})

const SavedContainer = styled.div({
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-evenly",
	backgroundColor: gray["75"],
	padding: "2.25rem 0 3.5rem 0",

})

const SavedDiv = styled.div({
	width: "35rem"
})

const BottomSavedDiv= styled.div({
	"width": "35rem",

	"@media (max-width: 69.938rem)": {
		paddingTop: "2rem"
	},
})

const SavedHeader = styled.p({
	color: gray["25"],
	fontSize: "1.5rem",
	fontFamily: "SansPro700",
	paddingLeft: "1.5rem"
})

const SavedContent = styled.div({
	minHeight: "21.125rem",
	backgroundColor: gray["50"],
	margin: "0.75rem 1.5rem 0.25rem 1.5rem",
	borderRadius: "0.3rem",
})

const SavedItem = styled.div({
	padding: "0.75rem 1.5rem",
})

const SavedItemTopDiv = styled.div({})

const SavedItemBottomDiv = styled.div({
	display: "flex",
	justifyContent: "space-around"
})

const SavedItemName = styled(Link)({
	"textDecoration": "none",
	"color": gray["0"],
	"fontSize": '1.1rem',

	":hover, :active": {
		opacity: "0.75",
	}
})

const SavedItemLink = styled(Link)({
	"textDecoration": "none",
	"color": orange,

	":hover, :active": {
		textDecoration: "underline"
	}
})

const Tag = styled.span({
	color: gray["25"]
})

const ViewAllSaved = styled(Link)({
	"color": orange,
	"paddingLeft": "1.5rem",
	"textDecoration": "none",

	":hover, :active": {
		textDecoration: "underline"
	}
})

const NoSavedText = styled.p({
	fontStyle: "italic",
	padding: "0.75rem 1.5rem",
	color: gray["25"],
	fontSize: "1.2rem"
})

const ComingSoonText = styled.p({
	color: pink,
	textAlign: "center",
	marginTop: "2rem"
})

const ViewLbButton = styled.button({
	"border": "0",
	"backgroundColor": orange,
	"color": gray["0"],
	"padding": "0.5rem",
	"borderRadius": "0.25rem",
	"fontFamily": "SansPro700",
	"fontSize": "1rem",

	":hover, :active": {
		backgroundColor: pink,
		cursor: "pointer"
	}
})

export default function Home() {
	const { width } = useWindowSize()
	const router = useRouter()
	const [data, setData] = useState({
		dailyLbArr: [],
		lbLastUpdated: null
	})
	const [savedData, setSavedData] = useState()
	const [clanSearch, setClanSearch] = useState("")
	const { data: session } = useSession()
	const [fetchedOnSession, setFetchedOnSession] = useState(false) //avoid constant calls to DB for session

	useEffect(() => {
		getDailyLeaderboard({
			id: "global",
			limit: 10
		})
			.then(res => res.json())
			.then(data => setData(data))
			.catch(() => {})
	}, [])

	useEffect(() => {
		if (session && !fetchedOnSession) {
			fetch(`/api/user`)
				.then(res => res.json())
				.then(data => {
					setSavedData(data)
					setFetchedOnSession(true)

					return true
				})
				.catch(() => {})
		}
	}, [session, fetchedOnSession])

	const handleClanSearchChange = e => {
		setClanSearch(e.target.value)
	}

	const handleClanSubmit = async () => {
		const trimmedSearch = clanSearch.trim()

		if (trimmedSearch.length > 0) {
			const tagRegex = /^[A-Za-z0-9#]+$/
			const meetsTagReq = !!(trimmedSearch.length >= 5 && trimmedSearch.length <= 9 && trimmedSearch.match(tagRegex))

			if (meetsTagReq) {
				getClan(trimmedSearch)
					.then(data => {
						router.push(`/clan/${data.tag.substring(1)}`)

						return true
					})
					.catch((err) => {
						if (err.status === 404) {
							router.push({
								pathname: '/clan/search',
								query: {
									q: trimmedSearch
								}
							})
						}
						else handleCRError(err, router)
					})
			}
			else {
				router.push({
					pathname: '/clan/search',
					query: {
						q: trimmedSearch
					}
				})
			}
		}
	}

	return (
		<>
			<NextSeo
				title= "CWStats - Clash Royale War Analytics, Leaderboards, Stats & More!"
				description= "Everything CW. The recommended source for race analytics, stats, projections, leaderboards & more!"
				themeColor={pink}
				openGraph={{
					type: "website",
					url: "https://www.cwstats.com",
					title: "CWStats - Clash Royale War Analytics, Leaderboards, Stats & More!",
					description:"Everything CW. The recommended source for race analytics, stats, projections, leaderboards & more!",
					images: [
						{
							url: "/assets/icons/logo.png",
							alt: "CWStats Logo"
						}
					]
				}}
			/>

			<TopContainer>
				<TopHeader>Everything CW.</TopHeader>
				<TopSubHeader>Detailed war analytics, leaderboards, stats & more!</TopSubHeader>

				<SearchContainer>
					<SearchDiv>
						<SearchHeader>Players</SearchHeader>
						<SearchBarContainer>
							<SearchBar placeholder="Name or tag, e.g. VGRQ9CVG" />
							<SearchButton onClick={() => router.push('/player/search')}>
								<SearchIcon />
							</SearchButton>
						</SearchBarContainer>
					</SearchDiv>
					<SearchDiv style={width < 905 ? {
						marginTop: "1.5rem"
					} : null}>
						<SearchHeader>Clans</SearchHeader>
						<SearchBarContainer>
							<SearchBar onChange={handleClanSearchChange} placeholder="Name or tag, e.g. 9U82JJ0Y" />
							<SearchButton onClick={handleClanSubmit}>
								<SearchIcon />
							</SearchButton>
						</SearchBarContainer>
					</SearchDiv>
				</SearchContainer>

				<ComingSoonText>* Live search results coming soon</ComingSoonText>
			</TopContainer>

			<SavedContainer>
				<SavedDiv>
					<SavedHeader>My Clans</SavedHeader>
					{session ? <SavedContent>
						{!savedData || savedData.savedClans.length === 0 ? <NoSavedText>No clans saved!</NoSavedText> : savedData.savedClans.slice(0, 5).map((c, index) => {
							return (
								<SavedItem key={index}>
									<SavedItemTopDiv>
										<SavedItemName href={`/clan/${c.tag.substring(1)}`}>
											{c.name}
											<Tag>{` (${c.tag})`}</Tag>
										</SavedItemName>
									</SavedItemTopDiv>
									<SavedItemBottomDiv>
										<SavedItemLink href={`/clan/${c.tag.substring(1)}/race`}>Race</SavedItemLink>
										<SavedItemLink href={`/clan/${c.tag.substring(1)}/log`}>Log</SavedItemLink>
										<SavedItemLink href={`/clan/${c.tag.substring(1)}/stats`}>Stats</SavedItemLink>
									</SavedItemBottomDiv>
								</SavedItem>
							)
						})}
					</SavedContent> : <LoginOverlay />}
					{savedData && savedData.savedClans.length > 5 ? <ViewAllSaved href="/me/clans">View All...</ViewAllSaved>: null}
				</SavedDiv>
				<BottomSavedDiv>
					<SavedHeader>My Players</SavedHeader>
					{session ?
						<SavedContent>
							{!savedData || savedData.savedPlayers.length === 0 ? <NoSavedText>No players saved!</NoSavedText> : savedData.savedPlayers.slice(0, 5).map((p, index) => {
								return (
									<SavedItem key={index}>
										<SavedItemTopDiv>
											<SavedItemName href={`/player/${p.tag.substring(1)}`}>
												{p.name}
												<Tag>{` (${p.tag})`}</Tag>
											</SavedItemName>
										</SavedItemTopDiv>
										<SavedItemBottomDiv>
											<SavedItemLink href={`/player/${p.tag.substring(1)}/war`}>War</SavedItemLink>
											<SavedItemLink href={`/player/${p.tag.substring(1)}/battles`}>Battles</SavedItemLink>
											<SavedItemLink href={`/player/${p.tag.substring(1)}/cards`}>Cards</SavedItemLink>
										</SavedItemBottomDiv>
									</SavedItem>
								)
							})}
						</SavedContent> : <LoginOverlay />}

					{savedData && savedData.savedPlayers.length > 5 ? <ViewAllSaved href="/me/players">View All...</ViewAllSaved>: null}
				</BottomSavedDiv>
			</SavedContainer>

			<Leaderboard clans={data.dailyLbArr} lbLastUpdated={data.lbLastUpdated} />

			<BottomContainer>
				<ViewLbButton onClick={() => router.push('/leaderboard/daily/global')}>View Leaderboard</ViewLbButton>
			</BottomContainer>
		</>
	)
}