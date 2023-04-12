import Image from "next/image"
import { useRouter } from "next/router"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray } from "../../public/static/colors"
import { parseDate } from "../../utils/date-time"
import { getClanBadgeFileName } from "../../utils/files"
import ClanLogsParticipants from "./ClanLogsParticipants"

const Header = styled.h2({
    color: gray["0"],
    marginTop: "2rem",
    textAlign: "center",

    "@media (max-width: 480px)": {
        fontSize: "1.5rem",
    },
})

const ContentDiv = styled.div({})

const ContentHeaderDiv = styled.div({
    display: "flex",
    justifyContent: "space-between",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    padding: "0.75rem 1rem",
    background: "rgb(255,165,0)",
    // eslint-disable-next-line no-dupe-keys
    background:
        "linear-gradient(90deg, rgba(255,165,0,1) 0%, rgba(255,35,122,1) 100%)",
    color: gray["0"],
    alignItems: "center",
    marginTop: "1rem",

    "@media (max-width: 480px)": {
        padding: "0.5rem 0.75rem",
        fontSize: "0.9rem",
    },
})

const HeaderText = styled.p({})

const Date = styled(HeaderText)({
    fontSize: "0.9rem",

    "@media (max-width: 480px)": {
        fontSize: "0.8rem",
    },
})

const ClansDiv = styled.div({})

const ClanItem = styled.div({
    padding: "1rem",
    backgroundColor: ({ isClan }) => (isClan ? gray["50"] : gray["75"]),
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${gray["100"]}`,
    display: "flex",

    ":hover, :active": {
        cursor: ({ isClan }) => (isClan ? null : "pointer"),
        backgroundColor: ({ isClan }) => (isClan ? null : gray["100"]),
    },

    "@media (max-width: 480px)": {
        padding: "0.75rem",
        fontSize: "0.75rem",
    },
})

const ClanItemText = styled.p({
    flex: ({ flex }) => flex,
    justifyContent: ({ alignRight }) => (alignRight ? "right" : null),
    color: gray["0"],
    display: "inline-flex",
    alignItems: "center",
})

const ClanBadge = styled(Image)({
    marginRight: "0.5rem",
})

const ClanIcon = styled(Image)({
    marginLeft: "0.25rem",
})

const TrophyChange = styled.span({
    color: gray["25"],
    fontSize: "0.9rem",
    marginRight: "0.25rem",

    "@media (max-width: 480px)": {
        fontSize: "0.7rem",
    },
})

export default function ClanLogs({ clanTag, log }) {
    const router = useRouter()
    const { width } = useWindowSize()

    const isMobile = width <= 480

    const clanBadgeHeight = isMobile ? 22 : 26
    const clanBadgeWidth = isMobile ? 16 : 20

    const iconPx = isMobile ? 16 : 18

    return (
        <>
            <Header>Logs</Header>

            {log.map((w, index) => {
                const clan = w.standings.find((c) => c.clan.tag === clanTag)

                return (
                    <ContentDiv
                        key={index}
                        id={`${w.seasonId}-${w.sectionIndex}`}
                    >
                        <ContentHeaderDiv>
                            <HeaderText>
                                Season {w.seasonId} - Week {w.sectionIndex + 1}
                            </HeaderText>
                            <Date>
                                {parseDate(w.createdDate).toUTCString()}
                            </Date>
                        </ContentHeaderDiv>

                        <ClansDiv>
                            {w.standings.map((c, index) => {
                                const isClan = clan.clan.tag === c.clan.tag
                                const changeVal = `${
                                    c.trophyChange > 0 ? "+" : ""
                                }${c.trophyChange}`

                                return (
                                    <ClanItem
                                        isClan={isClan}
                                        key={index}
                                        onClick={() =>
                                            isClan
                                                ? null
                                                : router.push(
                                                      `/clan/${c.clan.tag.substring(
                                                          1
                                                      )}/log`
                                                  )
                                        }
                                    >
                                        <ClanItemText
                                            flex={isMobile ? 0.15 : 0.25}
                                        >
                                            {c.rank}
                                        </ClanItemText>
                                        <ClanItemText
                                            flex={isMobile ? 0.85 : 0.75}
                                        >
                                            <ClanBadge
                                                src={`/assets/badges/${getClanBadgeFileName(
                                                    c.clan.badgeId,
                                                    c.clan.clanScore
                                                )}.png`}
                                                height={clanBadgeHeight}
                                                width={clanBadgeWidth}
                                            />
                                            {c.clan.name}
                                        </ClanItemText>
                                        <ClanItemText
                                            flex={0.5}
                                            alignRight
                                        >
                                            {c.clan.fame}
                                            <ClanIcon
                                                src="/assets/icons/boat-movement.png"
                                                height={iconPx}
                                                width={isMobile ? 19 : 21}
                                            />
                                        </ClanItemText>
                                        <ClanItemText
                                            flex={0.5}
                                            alignRight
                                        >
                                            <TrophyChange>
                                                {changeVal}
                                            </TrophyChange>
                                            {c.clan.clanScore}
                                            <ClanIcon
                                                src="/assets/icons/cw-trophy.png"
                                                height={iconPx}
                                                width={iconPx}
                                            />
                                        </ClanItemText>
                                    </ClanItem>
                                )
                            })}
                        </ClansDiv>

                        <ClanLogsParticipants
                            participants={clan.clan.participants}
                        />
                    </ContentDiv>
                )
            })}
        </>
    )
}
