import { useEffect, useState } from "react"
import styled from "styled-components"
import { addClan, getClan, getUser, saveClan, unsaveClan } from "../../../utils/services"
import { useRouter } from 'next/router'
import { gray, orange, pink } from "../../../public/static/colors"
import Image from 'next/image'
import { getClanBadgeFileName, getCountryKeyById } from "../../../utils/files"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { BiLinkExternal } from "react-icons/bi"
import { useSession } from "next-auth/react"
import useDebouncedCallback from "../../../hooks/useDebouncedCallback"
import Link from "next/link"
import { formatClanType, handleCRError } from "../../../utils/functions"
import MembersTable from "../../../components/Tables/ClanMembers"
import { parseDate, relativeDateStr } from "../../../utils/date-time"
import useWindowSize from "../../../hooks/useWindowSize"
import Head from "next/head"

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

const HeaderDiv = styled.div({
	"background": gray["50"],
	// eslint-disable-next-line no-dupe-keys
	"background": `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,
	"padding": "2rem",
	"color": gray["0"],
	"display": "flex",
	"justifyContent": "space-between",
	"alignItems": "center",

	"@media (max-width: 480px)": {
		padding: "1rem"
	},
})

const LeftDiv = styled.div({})

const TopHeaderDiv = styled.div({
	display: "flex",
	alignItems: "center"
})

const BottomHeaderDiv = styled.div({
	"display": "flex",
	"marginTop": "1rem",
	"alignItems": "center",

	"@media (max-width: 480px)": {
		marginTop: "0.5rem",
		fontSize: "0.75rem"
	},
})

const Name = styled.h1({
	"fontSize": "2.25rem",

	"@media (max-width: 480px)": {
		fontSize: "1.5rem"
	},
})

const Tag = styled.p({
	color: gray["25"]
})

const Trophy = styled(Image)({
	"marginLeft": "1.5rem",
	"marginRight": "0.5rem",

	"@media (max-width: 480px)": {
		marginRight: "0.25rem",
	},
})

const WarTrophy = styled(Image)({
	"marginLeft": "1.5rem",
	"marginRight": "0.5rem",

	"@media (max-width: 480px)": {
		marginRight: "0.25rem",
	},
})

const Badge = styled(Image)({})

const IconDiv = styled.div({
	"display": "flex",
	"alignItems": "center",
	"backgroundColor": gray["75"],
	"padding": "0.5rem",
	"borderRadius": "0.4rem",
	"marginLeft": "0.75rem",

	"@media (max-width: 480px)": {
		padding: "0.4rem",
	},
})

const InGameLink = styled(Link)({
	"display": "flex",
	"alignItems": "center",
	"backgroundColor": gray["75"],
	"padding": "0.5rem",
	"borderRadius": "0.4rem",
	"marginLeft": "0.5rem",

	"@media (max-width: 480px)": {
		padding: "0.4rem",
	},
})

const BookmarkFill = styled(FaBookmark)({
	"color": pink,

	":hover, :active": {
		cursor: "pointer"
	}
})

const Bookmark = styled(FaRegBookmark)({
	"color": pink,

	":hover, :active": {
		cursor: "pointer"
	}
})

const InGameLinkIcon = styled(BiLinkExternal)({
	"color": gray["25"],

	":hover, :active": {
		cursor: "pointer",
		color: orange
	}
})

const NavDiv = styled.div({
	display: "flex",

})

const NavItem = styled.div({
	"color": gray["0"],
	"padding": "0.5rem 1rem",

	":hover, :active": {
		cursor: "pointer",
	},

	"@media (max-width: 480px)": {
		fontSize: "0.9rem",
	},
})

const InfoDiv = styled.div({
	"margin": "1.5rem 0",
	"padding": "0 1rem",

	"@media (max-width: 480px)": {
		margin: '1rem 0'
	},
})

const Description = styled.p({
	"color": gray["25"],

	"@media (max-width: 480px)": {
		fontSize: "0.85rem",
	},
})

const StatsRow = styled.div({
	display: "flex",
	marginTop: "1rem"
})

const StatsItem = styled.div({
	display: "flex",
	alignItems: "center",
	width: "33.3%",
})

const StatsIcon = styled(Image)({
	"marginRight": "1rem",

	"@media (max-width: 480px)": {
		marginRight: "0.5rem",
	},
})

const FlagIcon = styled(StatsIcon)({
	borderRadius: "1rem"
})

const StatsInfo = styled.div({})

const StatsTitle = styled.p({
	"color": gray["25"],

	"@media (max-width: 480px)": {
		fontSize: "0.75rem",
	},
})

const StatsValue = styled.p({
	"color": gray["0"],
	"fontSize": "0.9rem",

	"@media (max-width: 480px)": {
		fontSize: "0.7rem",
	},
})

export default function ClanHome() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const { width } = useWindowSize()
	const [clan, setClan] = useState({})
	const [fetchedOnSession, setFetchedOnSession] = useState(false) //avoid constant calls to API on session
	const [bookmarkHover, setBookmarkHover] = useState(false)
	const [saved, setSaved] = useState(false)

	const { tag } = router.query

	const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)
	const locationKey = getCountryKeyById(clan.location?.id)
	const clanType = formatClanType(clan.type)

	useEffect(() => {
		if (!fetchedOnSession && tag && router) {
			getClan(tag)
				.then(setClan)
				.catch(err => handleCRError(err, router))

			setFetchedOnSession(true)
		}
	}, [
		tag,
		fetchedOnSession,
		router
	])

	useEffect(() => {
		if (session && clan && router) {
			getUser()
				.then((data) => {
					const isSaved = !!(data?.savedClans || []).find(c => c.tag === clan.tag)

					setSaved(isSaved)
					setBookmarkHover(isSaved)

					return true
				})
				.catch(() => {})
		}
	}, [
		session,
		clan,
		router
	])

	useEffect(() => {
		if (clan && badgeName !== 'no_clan')
			addClan(clan.name, clan.tag, badgeName)

		return () => {}

	}, [clan, badgeName])

	const updateSavedItem = useDebouncedCallback(() => {
		if (saved) unsaveClan(clan.tag)
		else saveClan(clan.name, clan.tag, badgeName)
	}, 1500)

	const onMouseEnter = () => {
		setBookmarkHover(!saved)
	}

	const onMouseLeave = () => {
		setBookmarkHover(saved)
	}

	const toggleSavedItem = () => {
		if (status === "authenticated") {
			setBookmarkHover(!saved)
			updateSavedItem()
			setSaved(!saved)
		}
		else
			router.push("/login")
	}

	const badgeHeightPx = width <= 480 ? 44 : 66
	const badgeWidthPx = width <= 480 ? 32 : 48

	const iconPx = width <= 480 ? 16 : 20

	const infoIconPx = width <= 480 ? 24 : 30

	return (
		<>
			<Head>
				<title>- Home</title>
			</Head>
			<Main>
				<HeaderDiv>

					<LeftDiv>
						<TopHeaderDiv>
							<Name>{clan.name}</Name>
							<IconDiv>
								{
									bookmarkHover ?
										<BookmarkFill onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleSavedItem} onTouchStart={toggleSavedItem} /> :
										<Bookmark onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleSavedItem} onTouchStart={toggleSavedItem} />
								}
							</IconDiv>
							<InGameLink href={`https://link.clashroyale.com/?clanInfo?id=${clan?.tag?.substring(1)}`} target="_blank" rel="noopener noreferrer">
								<InGameLinkIcon />
							</InGameLink>
						</TopHeaderDiv>

						<BottomHeaderDiv>
							<Tag>{clan.tag}</Tag>
							<Trophy src="/assets/icons/trophy.png" height={iconPx} width={iconPx} alt="Trophy" />{clan.clanScore}
							<WarTrophy src="/assets/icons/cw-trophy.png" height={iconPx} width={iconPx} alt="War Trophy" />{clan.clanWarTrophies}
						</BottomHeaderDiv>
					</LeftDiv>

					<Badge src={`/assets/badges/${badgeName}.png`} height={badgeHeightPx} width={badgeWidthPx} alt="Badge" />
				</HeaderDiv>

				<NavDiv>
					<NavItem style={{
						borderBottom: `3px solid ${pink}`
					}}>Home</NavItem>
					<NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}/race`)}>Race</NavItem>
					<NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}/log`)}>Log</NavItem>
					<NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}/stats`)}>Stats</NavItem>
				</NavDiv>

				<InfoDiv>
					<Description>{clan.description}</Description>

					<StatsRow>
						<StatsItem>
							<StatsIcon src="/assets/icons/trophy-ribbon.png" height={infoIconPx} width={infoIconPx} alt="Trophies" />
							<StatsInfo>
								<StatsTitle>Trophies</StatsTitle>
								<StatsValue>{clan.clanScore}</StatsValue>
							</StatsInfo>
						</StatsItem>
						<StatsItem>
							<StatsIcon src="/assets/icons/trophy.png" height={infoIconPx} width={infoIconPx} alt="Required Trophies" />
							<StatsInfo>
								<StatsTitle>{width <= 480 ? 'Req. Trophies' : "Required Trophies"}</StatsTitle>
								<StatsValue>{clan.requiredTrophies}</StatsValue>
							</StatsInfo>
						</StatsItem>
						<StatsItem>
							<StatsIcon src="/assets/icons/cards.png" height={infoIconPx} width={infoIconPx} alt="Weekly Donations" />
							<StatsInfo>
								<StatsTitle>{width <= 480 ? 'Donations' : "Weekly Donations"}</StatsTitle>
								<StatsValue>{clan.donationsPerWeek}</StatsValue>
							</StatsInfo>
						</StatsItem>
					</StatsRow>
					<StatsRow>
						<StatsItem>
							<StatsIcon src="/assets/icons/social.png" height={infoIconPx * 1.2} width={infoIconPx} alt="Members" />
							<StatsInfo>
								<StatsTitle>Members</StatsTitle>
								<StatsValue>{clan.members} / 50</StatsValue>
							</StatsInfo>
						</StatsItem>
						<StatsItem>
							<StatsIcon src="/assets/icons/players.png" height={infoIconPx} width={infoIconPx} alt="Type" />
							<StatsInfo>
								<StatsTitle>Type</StatsTitle>
								<StatsValue>{clanType}</StatsValue>
							</StatsInfo>
						</StatsItem>
						<StatsItem>
							<FlagIcon src={`/assets/flags/${locationKey}.png`} height={infoIconPx} width={infoIconPx} alt="Region" />
							<StatsInfo>
								<StatsTitle>Region</StatsTitle>
								<StatsValue>{clan.location?.name}</StatsValue>
							</StatsInfo>
						</StatsItem>
					</StatsRow>
				</InfoDiv>

				<MembersTable members={clan?.memberList?.map((m, index) => {
					const lastSeenDate = parseDate(m.lastSeen)

					return {
						...m,
						rank: index + 1,
						lastSeenStr: relativeDateStr(lastSeenDate),
						lastSeenDate
					}
				})} />
			</Main>
		</>

	)
}