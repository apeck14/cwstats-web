import Image from "next/image"
import styled from "styled-components"
import { gray, orange, pink } from "../../public/static/colors"
import { useSession, signOut } from "next-auth/react"
import useWindowSize from "../../hooks/useWindowSize"
import { useEffect, useState } from "react"
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

const TopDiv = styled.div({
	"display": "flex",
	"justifyContent": "space-between",
	"alignItems": "center",
	"marginBottom": "2.5rem",

	"@media (max-width: 1024px)": {
		marginBottom: "1.5rem",
	},
})

const HeaderDiv = styled.div({})

const ProfileDiv = styled.div({
	marginLeft: "1rem"
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

const ProfilePicture = styled(Image)({
	borderRadius: "50%",
	borderWidth: "2px",
	borderColor: pink,
	borderStyle: "solid"
})

const ProfileUsername = styled.p({
	"color": gray["25"],
	"textAlign": "center",

	"@media (max-width: 480px)": {
		fontSize: "0.9rem"
	},
})

const ContentDiv = styled.div({
	"display": "flex",
	"justifyContent": "space-between",
	"alignItems": "center",
	"backgroundColor": gray["50"],
	"borderRadius": "0.15rem",
	"borderWidth": "2px",
	"borderColor": gray["50"],
	"borderStyle": "solid",
	"margin": "1rem 0",
	"padding": "1rem",
	"color": gray["0"],

	":hover, :active": {
		borderWidth: "2px",
		borderColor: pink,
		borderStyle: "solid",
		cursor: "pointer"
	},
})

const ContentTitle = styled.p({
	fontSize: "1.4rem"
})

const ContentNumber = styled.p({
	backgroundColor: orange,
	borderRadius: "0.25rem",
	padding: "0.2rem 0.4rem",
	fontSize: "1.1rem"
})

const SignOutBtn = styled.button({
	"backgroundColor": pink,
	"color": gray["0"],
	"borderRadius": "0.25rem",
	"borderWidth": 0,
	"padding": "0.5rem 0.75rem",
	"fontFamily": "SansPro700",
	"fontSize": "0.9rem",
	"marginTop": "1rem",

	":hover, :active": {
		cursor: "pointer",
		backgroundColor: orange
	}
})

export default function Me() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { width } = useWindowSize()
	const [fetchedOnSession, setFetchedOnSession] = useState(false) //avoid constant calls to DB for session
	const [totalGuilds, setGuilds] = useState(0)
	const [savedData, setSavedData] = useState({
		savedClans: [],
		savedPlayers: []
	})

	const profilePicSize = width > 480 ? 65 : 50
	const defaultImage = "https://imgur.com/a/aQ3wFBL"

	useEffect(() => {
		if (session && !fetchedOnSession) {
			fetch(`/api/discord/guilds`)
				.then(res => res.json())
				.then(data => {
					setGuilds(data.length || 0)
					setFetchedOnSession(true)

					return true
				})
				.catch(() => {
					setGuilds("N/A")
				})

			fetch(`/api/user`)
				.then(res => res.json())
				.then(data => {
					setSavedData(data || {
						savedClans: [],
						savedPlayers: []
					})
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
				title="My CWStats"
			/>
			<Main>
				<TopDiv>
					<HeaderDiv>
						<Header>My CWStats</Header>
						<SubHeader>Manage Discord servers, or view saved clans and players!</SubHeader>
					</HeaderDiv>
					<ProfileDiv>
						<ProfilePicture src={session ? session.user.image : defaultImage} alt="Discord Profile" height={profilePicSize} width={profilePicSize} />
						<ProfileUsername>{session ? session.user.name : "Not Found"}</ProfileUsername>
					</ProfileDiv>
				</TopDiv>

				<ContentDiv onClick={() => router.push('/bot/setup')}>
					<ContentTitle>Servers</ContentTitle>
					<ContentNumber>{totalGuilds}</ContentNumber>
				</ContentDiv>
				<ContentDiv onClick={() => router.push('/me/clans')}>
					<ContentTitle>Clans</ContentTitle>
					<ContentNumber>{savedData.savedClans.length}</ContentNumber>
				</ContentDiv>
				<ContentDiv onClick={() => router.push('/me/players')}>
					<ContentTitle>Players</ContentTitle>
					<ContentNumber>{savedData.savedPlayers.length}</ContentNumber>
				</ContentDiv>

				<SignOutBtn onClick={() => signOut({
					callbackUrl: "/"
				})}>Sign Out</SignOutBtn>
			</Main>
		</>
	)
}