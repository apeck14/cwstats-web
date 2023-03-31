import { getClanBadgeFileName, getCountryKeyById } from "../../../utils/files.js"
import styled from "styled-components"
import { gray, pink } from "../../../public/static/colors.js"
import { FcGlobe } from "react-icons/fc"
import RankIcon from "./RankIcon.js"
import AttacksLeftImg from "../../../public/assets/icons/decksRemaining.png"
import AvgFameIcon from "./AvgFameIcon.js"
import Image from "next/image.js"
import { useRouter } from 'next/router'

const ItemDiv = styled.div({
	"display": "flex",
	"justifyContent": "space-between",
	"fontFamily": "SansPro600",
	"padding": "0.7rem 1rem",
	"backgroundColor": gray["75"],
	"borderRadius": "4px",
	"maxWidth": "64rem",
	"margin": "3px auto",

	":hover, :active": {
		cursor: "pointer",
		backgroundColor: gray["100"],
		borderLeft: `2px solid ${pink}`,
	},
})

const ClanBadge = styled(Image)({
	margin: "0px 20px",
	height: "2.5rem",
	width: "auto"
})

const ClanName = styled.p({
	"fontSize": "1.1rem",

	":hover, :active": {
		color: pink,
	},

	"@media (max-width: 450px)": {
		fontSize: "1rem",
	},
})

const Flag = styled(Image)({
	":hover, :active": {
		filter: "brightness(60%)",
		cursor: 'pointer',
	},
})

const EarthIcon = styled(FcGlobe)({
	fontSize: "28px",
	marginRight: "6px",
})

const Rank = styled.p({
	"@media (max-width: 450px)": {
		fontSize: "0.875rem",
	},
})

const AttacksLeftIcon = styled(Image)({
	height: "28px",
	width: "auto",
	marginRight: "6px",
})

const AttacksLeft = styled.p({})

const LeftItemSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
	flex: 1,
})

const CenterItemSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "space-between",
	flex: 1,
})

const RightItemSubDiv = styled.div({
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
})

const SubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "flex-start",
	flex: 1 / 3,
})

//Mobile ---------------------------------

const MobileItemDiv = styled.div({
	"display": "flex",
	"justifyContent": "space-between",
	"fontFamily": "SansPro600",
	"padding": "0.6rem 0.6rem",
	"backgroundColor": gray["75"],
	"marginBottom": "3px",
	"borderRadius": "4px",

	":hover, :active": {
		cursor: "pointer",
		backgroundColor: gray["100"],
		borderLeft: `2px solid ${pink}`,
	},
})

const MobileLeftSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
	flex: 0.8,
})

const MobileLeftSubDivContainer = styled.div({
	display: "flex",
	flexDirection: "column",
	marginLeft: "10px",
})

const MobileSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center"
})

const MobileFlag = styled(Image)({
	":hover, :active": {
		filter: "brightness(60%)",
	},
})

const MobileEarthIcon = styled(FcGlobe)({
	fontSize: "0.875",
	margin: "0px 2px 0px 8px"
})

const MobileClanBadge = styled(Image)({
	"margin": "0px 0px 0px 10px",

	"@media (max-width: 450px)": {
		margin: "0px 0px 0px 8px",
		height: "2.2rem",
		width: "auto"
	},
})

const MobileCenterSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
	flex: 0.2,
})

const MobileRightSubDiv = styled.div({
	display: "inline-flex",
	alignItems: "center",
})

const MobileAttacksLeft = styled.p({
	marginRight: "10px"
})

const MobileAttacksLeftIcon = styled(Image)({
	"height": "24px",
	"width": "auto",
	"marginRight": "4px",

	"@media (max-width: 450px)": {
		height: "22px",
		width: "auto"
	},
})

export default function Item({ index, clan, isTablet, isMobile }) {
	const router = useRouter()
	const clanBadgeUrl = `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanScore)}.png`
	const countryKey = getCountryKeyById(clan.location.id)
	const flagUrl = `/assets/flags/${countryKey}.png`

	return isTablet ? (
		<MobileItemDiv key={index} onClick={() => router.push(`/clan/${clan.tag.substring(1)}/race`)}>
			<MobileLeftSubDiv>
				<RankIcon number={index + 1} size={isMobile ? "20px" : "22px"} />
				<MobileClanBadge src={clanBadgeUrl} alt="clan badge" height={40} width={40} />

				<MobileLeftSubDivContainer>
					<MobileSubDiv>
						<ClanName onClick={() => router.replace(`/clan/${clan.tag.substring(1)}`)}>{clan.name}</ClanName>
					</MobileSubDiv>
					<MobileSubDiv>
						<MobileFlag onClick={() => router.replace(`/leaderboard/daily/${countryKey.toUpperCase()}`)} src={flagUrl} alt="region flag" height={12} width={20} />
						<MobileEarthIcon />
						<Rank>#{clan.rank}</Rank>
					</MobileSubDiv>
				</MobileLeftSubDivContainer>
			</MobileLeftSubDiv>
			<MobileCenterSubDiv>
				<MobileAttacksLeftIcon src={AttacksLeftImg} alt="attacks left" />
				<MobileAttacksLeft>{clan.decksRemaining}</MobileAttacksLeft>
			</MobileCenterSubDiv>
			<MobileRightSubDiv>
				<AvgFameIcon number={clan.fameAvg} dailyRank={index + 1} size={isMobile ? 0.75 : 1} />
			</MobileRightSubDiv>
		</MobileItemDiv>
	) : (
		<ItemDiv key={index} onClick={() => router.push(`/clan/${clan.tag.substring(1)}/race`)}>
			<LeftItemSubDiv>
				<RankIcon number={index + 1} size="24px" />
				<ClanBadge src={clanBadgeUrl} alt="clan badge" height={40} width={40} />
				<ClanName onClick={() => router.replace(`/clan/${clan.tag.substring(1)}`)}>{clan.name}</ClanName>
			</LeftItemSubDiv>

			<CenterItemSubDiv>
				<SubDiv>
					<Flag onClick={() => router.replace(`/leaderboard/daily/${countryKey.toUpperCase()}`)} src={flagUrl} alt="region flag" height={25.6} width={43.2} />
				</SubDiv>
				<SubDiv>
					<EarthIcon />
					<Rank>#{clan.rank}</Rank>
				</SubDiv>
				<SubDiv>
					<AttacksLeftIcon src={AttacksLeftImg} alt="attacks left"/>
					<AttacksLeft>{clan.decksRemaining}</AttacksLeft>
				</SubDiv>
			</CenterItemSubDiv>

			<RightItemSubDiv>
				<AvgFameIcon dailyRank={index + 1} number={clan.fameAvg} />
			</RightItemSubDiv>
		</ItemDiv>
	)
}