import { useEffect, useState } from "react"
import styled from "styled-components"
import { gray, orange, pink } from "../../public/static/colors"
import { useSession } from "next-auth/react"
import SavedItem from "../../components/Saved/Item"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"

const Main = styled.div({
	"width": "60%",
	"margin": "0 auto",
	"padding": "3rem 0",
	"fontFamily": "SansPro600",

	"@media (max-width: 480px)": {
		width: "90%"
	},
})

const Header = styled.h1({
	"color": gray["0"],
	"fontSize": "3rem",

	"@media (max-width: 1024px)": {
		fontSize: "2.75rem"
	},

	"@media (max-width: 480px)": {
		fontSize: "2rem"
	},
})

const SubHeader = styled.h2({
	"color": gray["25"],
	"fontSize": "1.1rem",
	"fontWeight": 500,

	"@media (max-width: 1024px)": {
		fontSize: "1rem"
	},

	"@media (max-width: 480px)": {
		fontSize: "0.9rem"
	},
})

const ContentDiv = styled.div({
	backgroundColor: gray["75"],
	minHeight: "25rem",
	padding: "1rem",
	margin: "1rem 0",
	borderRadius: "0.25rem"
})

const LoadMoreDiv = styled.div({
	display: "flex",
	justifyContent: "center",
	marginTop: "2rem"
})

const LoadMore = styled.button({
	"padding": "0.5rem",
	"backgroundColor": pink,
	"border": "none",
	"color": gray["0"],
	"fontFamily": "SansPro700",
	"margin": "auto",
	"borderRadius": "1rem",

	":hover, :active": {
		cursor: "pointer",
		backgroundColor: orange
	}
})

const NoneText = styled.p({
	color: gray["0"],
	fontStyle: "italic"
})

export default function Players() {
	const { data: session, status } = useSession()
	const [players, setPlayers] = useState([])
	const [fetchedOnSession, setFetchedOnSession] = useState(false) //avoid constant calls to DB for session
	const [numShown, setNumShown] = useState(10)
	const router = useRouter()

	useEffect(() => {
		if (session && !fetchedOnSession) {
			fetch(`/api/user`)
				.then(res => res.json())
				.then(data => {
					setPlayers(data.savedPlayers || [])
					setFetchedOnSession(true)

					return true
				})
				.catch(() => {})
		}
	}, [session, fetchedOnSession])

	if (status === "loading") return null
	else if (status === "unauthenticated") {
		router.push("/login")

		return
	}

	return (
		<>
			<NextSeo
				title= "My Players"
				description= "View your saved players on CWStats."
				openGraph={{
					title: "My Players",
					description: "View your saved players on CWStats."
				}}
			/>

			<Main>
				<Header>My Players</Header>
				<SubHeader>View all saved players.</SubHeader>
				<ContentDiv>
					{
						players.length === 0 ?
							<NoneText>No players saved!</NoneText> :
							players.slice(0, numShown).map((p, index) => (
								<SavedItem
									key={index}
									name={p.name}
									tag={p.tag}
									isPlayer={true}
									links={[
										{
											name: "War",
											url: `/player/${p.tag.substring(1)}/war`
										},
										{
											name: "Battles",
											url: `/player/${p.tag.substring(1)}/battles`
										},
										{
											name: "Cards",
											url: `/player/${p.tag.substring(1)}/cards`
										}
									]}
								/>
							))}
				</ContentDiv>
				{ players.length > numShown ?
					<LoadMoreDiv>
						<LoadMore onClick={() => setNumShown(numShown + 10)}>Load More...</LoadMore>
					</LoadMoreDiv>
					: null
				}
			</Main>
		</>
	)
}