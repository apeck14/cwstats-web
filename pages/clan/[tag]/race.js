import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"
import { BiLinkExternal } from "react-icons/bi"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import styled from "styled-components"

import RaceNotFound from "../../../components/Race/NotFound"
import ProgressBar from "../../../components/Race/ProgressBar"
import RaceIcon from "../../../components/Race/RaceIcon"
import RaceLeaderboard from "../../../components/Tables/RaceLeaderboard"
import useDebouncedCallback from "../../../hooks/useDebouncedCallback"
import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import {
  formatTag,
  getAvgFame,
  getBattlesRemaining,
  getBestPlace,
  getCRErrorUrl,
  getDuelsRemaining,
  getMaxFame,
  getMinFame,
  getProjFame,
  getProjPlace,
  getRaceDetails,
  getWorstPlace,
  handleSCResponse,
} from "../../../utils/functions"
import {
  addClan,
  fetchClan,
  fetchRace,
  getUser,
  saveClan,
  unsaveClan,
} from "../../../utils/services"

const Main = styled.div({})

const HeaderDiv = styled.div({
  background: gray["50"],
  // eslint-disable-next-line no-dupe-keys
  background: `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,
  padding: "2rem",
  color: gray["0"],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "@media (max-width: 480px)": {
    padding: "1rem",
  },
})

const LeftDiv = styled.div({})

const TopHeaderDiv = styled.div({
  display: "flex",
  alignItems: "center",
})

const BottomHeaderDiv = styled.div({
  display: "flex",
  marginTop: "1rem",
  alignItems: "center",

  "@media (max-width: 480px)": {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
  },
})

const Name = styled.h1({
  fontSize: "2.25rem",

  "@media (max-width: 480px)": {
    fontSize: "1.5rem",
  },
})

const Tag = styled.p({
  color: gray["25"],
})

const Trophy = styled(Image)({
  marginLeft: "1.5rem",
  marginRight: "0.5rem",

  "@media (max-width: 480px)": {
    marginRight: "0.25rem",
  },
})

const WarTrophy = styled(Image)({
  marginLeft: "1.5rem",
  marginRight: "0.5rem",

  "@media (max-width: 480px)": {
    marginRight: "0.25rem",
  },
})

const Badge = styled(Image)({})

const IconDiv = styled.div({
  display: "flex",
  alignItems: "center",
  backgroundColor: gray["75"],
  padding: "0.5rem",
  borderRadius: "0.4rem",
  marginLeft: "0.75rem",

  "@media (max-width: 480px)": {
    padding: "0.4rem",
  },
})

const InGameLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  backgroundColor: gray["75"],
  padding: "0.5rem",
  borderRadius: "0.4rem",
  marginLeft: "0.5rem",

  "@media (max-width: 480px)": {
    padding: "0.4rem",
  },
})

const BookmarkFill = styled(FaBookmark)({
  color: pink,

  ":hover, :active": {
    cursor: "pointer",
  },
})

const Bookmark = styled(FaRegBookmark)({
  color: pink,

  ":hover, :active": {
    cursor: "pointer",
  },
})

const InGameLinkIcon = styled(BiLinkExternal)({
  color: gray["25"],

  ":hover, :active": {
    cursor: "pointer",
    color: orange,
  },
})

const NavDiv = styled.div({
  display: "flex",
})

const NavItem = styled.div({
  color: gray["0"],
  padding: "0.5rem 1rem",

  ":hover, :active": {
    cursor: "pointer",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },
})

const RaceDiv = styled.div({
  margin: "1.5rem 0",

  "@media (max-width: 1024px)": {
    padding: "0 1rem",
  },

  "@media (max-width: 480px)": {
    margin: "1rem 0",
  },
})

const ClanDiv = styled.div({
  display: "flex",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: gray["75"],
  margin: "0.25rem 0",
  borderRadius: "0.25rem",
  borderLeft: `3px solid ${gray["75"]}`,

  ":hover, :active": {
    cursor: "pointer",
    borderLeft: `3px solid ${pink}`,
  },

  "@media (max-width: 768px)": {
    fontSize: "0.9rem",
  },
})

const LeftClanDiv = styled.div({
  width: "55%",
  display: "flex",
  alignItems: "center",

  "@media (max-width: 1024px)": {
    marginLeft: "-3px",
  },
})

const LeftInfoDiv = styled.div({
  width: "100%",
})

const LeftTopDiv = styled.div({
  display: "flex",
  alignItems: "center",
  marginBottom: "1rem",
})

const RightClanDiv = styled.div({
  width: "45%",
  display: "flex",
  marginLeft: "1rem",
  justifyContent: "space-around",
})

const End = styled.div({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "flex-end",
})

const ClanBadge = styled(Image)({})

const ClanName = styled.p({
  color: gray["0"],
  marginLeft: "0.5rem",
  width: "500%",
})

const RightInfoDiv = styled.div({
  display: "flex",
  color: gray["0"],
  alignItems: "center",
})

const RaceImg = styled(Image)({
  marginRight: "0.25rem",
})

const Trophies = styled.p({
  color: gray["0"],
  fontSize: "0.9rem",
})

const FameAvg = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.5rem",
  borderWidth: "2px",
  borderColor: gray[""],
  borderStyle: "solid",
  padding: "0.5rem",
  backgroundColor: gray["50"],
  color: gray["0"],
  minWidth: "2.6rem",

  "@media (max-width: 1024px)": {
    padding: "0.25rem",
  },

  "@media (max-width: 650px)": {
    padding: "0.1rem",
    fontSize: "0.6rem",
    border: "none",
    borderRadius: "0.25rem",
    maxHeight: "1rem",
    marginTop: "0.45rem",
  },
})

const MobileClanDiv = styled.div({
  display: "flex",
  padding: "0.75rem",
  backgroundColor: gray["75"],
  margin: "0.25rem 0",
  borderRadius: "0.25rem",
  borderLeft: `3px solid ${gray["75"]}`,

  ":hover, :active": {
    cursor: "pointer",
  },

  "@media (max-width: 768px)": {
    fontSize: "0.9rem",
  },
})

const MobileLeftDiv = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: "2.8rem",
  marginRight: "0.5rem",
})

const MobileRightDiv = styled.div({
  width: "100%",
})

const MobileTopDiv = styled.div({
  marginBottom: "0.6rem",
  display: "flex",
})

const MobileTopRight = styled.div({
  width: "45%",
  display: "flex",
  justifyContent: "space-between",
})

const MobileTopLeft = styled.div({
  width: "55%",
})

const MobileBottomDiv = styled.div({
  width: "100%",
})

const MobileTopItem = styled.div({
  display: "flex",
  alignItems: "center",
  color: gray["0"],
})

const StatsDiv = styled.div({
  "@media (max-width: 1024px)": {
    padding: "0 1rem",
  },

  "@media (max-width: 768px)": {
    fontSize: "0.75rem",
  },
})

const Stat = styled.div({
  display: "flex",
  justifyContent: "space-between",
  borderTop: `1px solid ${gray["50"]}`,
  padding: "0.5rem 0",

  "@media (max-width: 768px)": {
    padding: "0.5rem 0",
    fontSize: "0.8rem",
  },
})

const StatTitle = styled.p({
  color: gray["25"],
})

const StatValue = styled.p({
  color: gray["0"],
})

const StatsHeader = styled.h1({
  color: gray["0"],
  textAlign: "center",
})

const StatsSubHeader = styled.p({
  color: gray["25"],
  textAlign: "center",
  fontStyle: "italic",
  marginBottom: "1rem",
})

export default function ClanRace({ clan, race }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { width } = useWindowSize()
  const [isSaved, setIsSaved] = useState(false)

  const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

  useEffect(() => {
    if (session && clan) {
      getUser()
        .then((data) => {
          const saved = !!(data?.savedClans || []).find(
            (c) => c.tag === clan.tag
          )

          setIsSaved(saved)

          return saved
        })
        .catch(() => {})
    }
  }, [session, clan])

  useEffect(() => {
    if (clan && badgeName !== "no_clan") addClan(clan.name, clan.tag, badgeName)

    return () => {}
  }, [clan, badgeName])

  const updateSavedItem = useDebouncedCallback(() => {
    if (isSaved) unsaveClan(clan.tag)
    else saveClan(clan.name, clan.tag, badgeName)
  }, 1500)

  if (race.state === "matchmaking") {
    router.push("/matchmaking")

    return
  }

  const isColosseum = race.periodType === "colosseum"
  const dayOfWeek = race.periodIndex % 7
  const raceClans = getRaceDetails(race.clans, isColosseum)

  const toggleSavedItem = () => {
    if (status === "authenticated") {
      updateSavedItem()
      setIsSaved(!isSaved)
    } else router.push("/login")
  }

  const isMobile = width <= 480
  const showMobileView = width <= 650
  const badgeHeightPx = isMobile ? 44 : 66
  const badgeWidthPx = isMobile ? 32 : 48

  const iconPx = isMobile ? 16 : 20

  const getShownParticipants = () => {
    if (!clan.memberList || !race.clan.participants) return []

    return race.clan.participants
      .filter((p) => clan.memberList.find((m) => m.tag === p.tag) || p.fame > 0)
      .sort((a, b) => {
        if (a.fame === b.fame) return a.name.localeCompare(b.name)

        return b.fame - a.fame
      })
      .map((p, index) => ({
        ...p,
        rank: index + 1,
        inClan: !!clan.memberList.find((m) => m.tag === p.tag),
      }))
  }

  const raceNotFound = !race.clans || race.clans.length === 0

  return (
    <>
      <NextSeo
        title={`${clan.name} | Race - CWStats`}
        description="View current river race stats and projections."
        openGraph={{
          title: `${clan.name} | Race - CWStats`,
          description: "View current river race stats and projections.",
          images: [
            {
              url: `/assets/badges/${getClanBadgeFileName(
                clan.badgeId,
                clan.clanWarTrophies
              )}.png`,
              alt: "Clan Badge",
            },
          ],
        }}
      />
      <Main>
        <HeaderDiv>
          <LeftDiv>
            <TopHeaderDiv>
              <Name>{clan.name}</Name>
              <IconDiv>
                {isSaved ? (
                  <BookmarkFill onClick={toggleSavedItem} />
                ) : (
                  <Bookmark onClick={toggleSavedItem} />
                )}
              </IconDiv>
              <InGameLink
                href={`https://link.clashroyale.com/?clanInfo?id=${clan.tag.substring(
                  1
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InGameLinkIcon />
              </InGameLink>
            </TopHeaderDiv>

            <BottomHeaderDiv>
              <Tag>{clan.tag}</Tag>
              <Trophy
                src="/assets/icons/trophy.png"
                height={iconPx}
                width={iconPx}
                alt="Trophy"
              />
              {clan.clanScore}
              <WarTrophy
                src="/assets/icons/cw-trophy.png"
                height={iconPx}
                width={iconPx}
                alt="War Trophy"
              />
              {clan.clanWarTrophies}
            </BottomHeaderDiv>
          </LeftDiv>

          <Badge
            src={`/assets/badges/${badgeName}.png`}
            height={badgeHeightPx}
            width={badgeWidthPx}
            alt="Badge"
          />
        </HeaderDiv>

        <NavDiv>
          <NavItem
            onClick={() => router.push(`/clan/${clan.tag.substring(1)}`)}
          >
            Home
          </NavItem>
          <NavItem
            style={{
              borderBottom: `3px solid ${pink}`,
            }}
          >
            Race
          </NavItem>
          <NavItem
            onClick={() => router.push(`/clan/${clan.tag.substring(1)}/log`)}
          >
            Log
          </NavItem>
          <NavItem
            onClick={() => router.push(`/clan/${clan.tag.substring(1)}/stats`)}
          >
            Stats
          </NavItem>
        </NavDiv>

        {raceNotFound ? (
          <RaceNotFound />
        ) : (
          <>
            <RaceDiv>
              {raceClans.map((c) => {
                const clanInRace = race.clans.find((cl) => cl.tag === c.tag)

                return showMobileView ? (
                  <MobileClanDiv
                    key={c.tag}
                    onClick={() =>
                      router.push(`/clan/${c.tag.substring(1)}/race`)
                    }
                    style={
                      c.tag === clan.tag
                        ? {
                            borderLeft: `3px solid ${pink}`,
                          }
                        : null
                    }
                  >
                    <MobileLeftDiv
                      style={
                        c.placement === Infinity && !c.crossedFinishLine
                          ? {
                              marginRight: "0",
                              minWidth: "0",
                            }
                          : null
                      }
                    >
                      <RaceIcon
                        place={c.placement}
                        isFinished={c.crossedFinishLine}
                      />
                      {c.placement === Infinity ? null : (
                        <FameAvg>
                          {getAvgFame(
                            clanInRace,
                            isColosseum,
                            dayOfWeek
                          ).toFixed(2)}
                        </FameAvg>
                      )}
                    </MobileLeftDiv>

                    <MobileRightDiv>
                      <MobileTopDiv
                        style={
                          c.crossedFinishLine
                            ? {
                                marginBottom: "0",
                              }
                            : null
                        }
                      >
                        <MobileTopLeft>
                          <MobileTopItem>
                            <ClanBadge
                              src={`/assets/badges/${getClanBadgeFileName(
                                c.badgeId,
                                c.trophies
                              )}.png`}
                              height={isMobile ? 24 : 32}
                              width={isMobile ? 18 : 24}
                            />
                            <ClanName>{c.name}</ClanName>
                          </MobileTopItem>
                        </MobileTopLeft>

                        <MobileTopRight>
                          <MobileTopItem>
                            <RaceImg
                              src="/assets/icons/boat-movement.png"
                              height={18}
                              width={21}
                            />
                            {c.boatPoints}
                          </MobileTopItem>
                          <MobileTopItem>
                            <RaceImg
                              src="/assets/icons/fame.png"
                              height={16}
                              width={12}
                            />
                            {c.fame}
                          </MobileTopItem>
                        </MobileTopRight>
                      </MobileTopDiv>
                      {c.crossedFinishLine ? null : (
                        <MobileBottomDiv>
                          <ProgressBar
                            fame={c.fame}
                            isColosseum={isColosseum}
                            projectedFame={getProjFame(
                              clanInRace,
                              isColosseum,
                              dayOfWeek
                            )}
                          />
                        </MobileBottomDiv>
                      )}
                    </MobileRightDiv>
                  </MobileClanDiv>
                ) : (
                  <ClanDiv
                    key={c.tag}
                    onClick={() =>
                      router.push(`/clan/${c.tag.substring(1)}/race`)
                    }
                    style={
                      c.tag === clan.tag
                        ? {
                            borderLeft: `3px solid ${pink}`,
                          }
                        : null
                    }
                  >
                    <LeftClanDiv>
                      <RaceIcon
                        place={c.placement}
                        isFinished={c.crossedFinishLine}
                      />
                      <LeftInfoDiv>
                        <LeftTopDiv>
                          <ClanBadge
                            src={`/assets/badges/${getClanBadgeFileName(
                              c.badgeId,
                              c.trophies
                            )}.png`}
                            height={isMobile ? 24 : 32}
                            width={isMobile ? 18 : 24}
                          />
                          <ClanName>{c.name}</ClanName>
                          <End>
                            <RaceImg
                              src="/assets/icons/cw-trophy.png"
                              height={16}
                              width={16}
                            />
                            <Trophies>{c.trophies}</Trophies>
                          </End>
                        </LeftTopDiv>
                        <ProgressBar
                          fame={c.fame}
                          isColosseum={isColosseum}
                          projectedFame={getProjFame(
                            clanInRace,
                            isColosseum,
                            dayOfWeek
                          )}
                        />
                      </LeftInfoDiv>
                    </LeftClanDiv>

                    <RightClanDiv>
                      <RightInfoDiv>
                        <RaceImg
                          src="/assets/icons/boat-movement.png"
                          height={24}
                          width={28}
                        />
                        {c.boatPoints}
                      </RightInfoDiv>
                      <RightInfoDiv>
                        <RaceImg
                          src="/assets/icons/fame.png"
                          height={24}
                          width={18}
                        />
                        {c.fame}
                      </RightInfoDiv>
                    </RightClanDiv>

                    <FameAvg>
                      {getAvgFame(clanInRace, isColosseum, dayOfWeek).toFixed(
                        2
                      )}
                    </FameAvg>
                  </ClanDiv>
                )
              })}
            </RaceDiv>

            <StatsDiv>
              <StatsHeader>Stats & Projections</StatsHeader>
              <StatsSubHeader>
                All projections assume 100% participation.
              </StatsSubHeader>
              <Stat>
                <StatTitle>Total Battles Remaining</StatTitle>
                <StatValue>
                  {getBattlesRemaining(race.clan.participants)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Duels Remaining</StatTitle>
                <StatValue>
                  {getDuelsRemaining(race.clan.participants)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Projected Medals</StatTitle>
                <StatValue>
                  {getProjFame(race.clan, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Maximum Possible Medals</StatTitle>
                <StatValue>
                  {getMaxFame(race.clan, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Minimum Possible Medals</StatTitle>
                <StatValue>
                  {getMinFame(race.clan, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Projected Place</StatTitle>
                <StatValue>
                  {getProjPlace(race, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Best Possible Place</StatTitle>
                <StatValue>
                  {getBestPlace(race, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
              <Stat>
                <StatTitle>Worst Possible Place</StatTitle>
                <StatValue>
                  {getWorstPlace(race, isColosseum, dayOfWeek)}
                </StatValue>
              </Stat>
            </StatsDiv>

            <RaceLeaderboard participants={getShownParticipants()} />
          </>
        )}
      </Main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { tag } = context.params
  const formattedTag = formatTag(tag, false)

  try {
    const [clanRes, raceRes] = await Promise.all([
      fetchClan(formattedTag),
      fetchRace(formattedTag),
    ])
    const [clan, race] = await Promise.all([
      handleSCResponse(clanRes),
      handleSCResponse(raceRes),
    ])

    return {
      props: {
        clan,
        race,
      },
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: getCRErrorUrl(err),
      },
      props: {},
    }
  }
}
