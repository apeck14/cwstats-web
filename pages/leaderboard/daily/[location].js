import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"
import { FcGlobe } from "react-icons/fc"
import { IoCaretBack, IoCaretDown, IoCaretForward } from "react-icons/io5"
import styled from "styled-components"

import LocationsModal from "../../../components/Modals/Locations"
import NotTracked from "../../../components/NotTracked"
import useWindowSize from "../../../hooks/useWindowSize"
import clientPromise from "../../../lib/mongodb"
import { gray, orange, pink } from "../../../public/static/colors"
import Locations from "../../../public/static/locations"
import { diffInMins } from "../../../utils/date-time"
import { getClanBadgeFileName, getCountryKeyById, getRegionByKey } from "../../../utils/files"

const Main = styled.div({
  margin: "0 auto",
  width: "70rem",

  "@media (max-width: 1200px)": {
    width: "80%",
  },

  "@media (max-width: 1024px)": {
    width: "100%",
  },
})

const HeaderDiv = styled.div({
  background: gray["50"],
  // eslint-disable-next-line no-dupe-keys
  background: `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,
  padding: "2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "@media (max-width: 480px)": {
    padding: "0.75rem",
  },
})

const Header = styled.h1({
  fontSize: "2.5rem",
  color: gray["0"],

  "@media (max-width: 1024px)": {
    fontSize: "2rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "1.15rem",
  },

  "@media (max-width: 400px)": {
    fontSize: "0.9rem",
  },
})

const HeaderIcon = styled(Image)({})

const ControlDiv = styled.div({
  display: "flex",
  backgroundColor: gray["100"],
  height: "2.25rem",
  justifyContent: "space-between",

  "@media (max-width: 480px)": {
    height: "2rem",
  },
})

const LeftControlDiv = styled.div({
  backgroundColor: gray["100"],
  color: gray["0"],
  display: "flex",
})

const RightControlDiv = styled.div({
  backgroundColor: "green",
  display: "flex",
})

const ToggleDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",

  ":hover, :active": {
    cursor: "pointer",
  },

  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.6rem",
  },
})

const PaginationDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: orange,
  color: gray["0"],
  padding: "1rem",

  ":hover, :active": {
    cursor: "pointer",
    filter: "brightness(80%)",
  },

  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },

  "@media (max-width: 480px)": {
    padding: "0.5rem",
    fontSize: "0.8rem",
  },
})

const RegionDropdown = styled.div({
  display: "flex",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: gray["75"],

  ":hover, :active": {
    cursor: "pointer",
    color: gray["25"],
  },

  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.6rem",
    padding: "0.6rem",
  },
})

const LeagueToggle = styled(Link)({
  display: "flex",
  alignItems: "center",
  padding: "1rem",
  textDecoration: "none",
  color: gray["0"],

  ":hover, :active": {
    cursor: "pointer",
    color: gray["25"],
  },

  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.6rem",
  },
})

const InfoDiv = styled.div({
  display: "flex",
  justifyContent: "space-between",
  margin: "1.5rem 0",
  color: gray["25"],

  "@media (max-width: 1024px)": {
    padding: "0 0.5rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.75rem",
    margin: "1rem 0",
  },
})

const LastUpdated = styled.p({})

const PageData = styled.p({})

const ContentTable = styled.table({
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "1rem",
})

const Row = styled.tr({
  color: gray["0"],
})

const THead = styled.th({
  color: gray["25"],
  borderBottom: `2px solid ${pink}`,
  padding: "0.5rem 0.75rem",

  "@media (max-width: 480px)": {
    padding: "0.25rem 0.4rem",
  },
})

const Cell = styled.td({
  padding: "0.75rem",
  borderTop: `1px solid ${gray["50"]}`,

  "@media (max-width: 1024px)": {
    padding: "0.5rem",
    fontSize: "0.8rem",
  },

  "@media (max-width: 480px)": {
    padding: "0.4rem",
    fontSize: "0.7rem",
  },
})

const Name = styled(Link)({
  textDecoration: "none",
  color: gray["0"],

  ":hover, :active": {
    cursor: "pointer",
    color: pink,
  },

  "@media (max-width: 480px)": {
    fontSize: "0.8rem",
  },
})

const CenterCell = styled(Cell)({
  textAlign: "center",
})

const FameCell = styled(Cell)({
  backgroundColor: gray["50"],
  textAlign: "center",
  fontSize: "1.05rem",

  "@media (max-width: 1024px)": {
    fontSize: "0.85rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.5rem",
  },
})

const ClanBadgeDiv = styled.div({
  width: "1.4rem",
  height: "2rem",
  position: "relative",
  overflow: "hidden",

  "@media (max-width: 480px)": {
    width: "0.95rem",
    height: "1.3rem",
  },
})

const ClanBadge = styled(Image)({
  objectFit: "contain",
  maxWidth: "100%",
  maxHeight: "100%",
  width: "auto",
  height: "auto",
})

const Flag = styled(Image)({
  verticalAlign: "middle",
})

const GlobeIcon = styled(FcGlobe)({})

const TrophiesIcon = styled(Image)({})

const AtksIcon = styled(Image)({})

const NotRanked = styled.p`
  color: ${gray["25"]};
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    font-size: 0.9rem;
    margin-left: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`

export default function Leaderboard({ region, data }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const [page, setPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { location: key, league } = router.query

  if (league && league !== "5000" && league !== "4000") router.push(`/leaderboard/daily/${key}`)

  const totalPages = Math.floor(data.dailyLbArr.length / 100) + (data.dailyLbArr.length % 100 === 0 ? 0 : 1)
  const isTracked = region.isAdded || region.key === "global"

  const incrementPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const decrementPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const navigateLeagues = (newLeague) => {
    if (!newLeague) return `/leaderboard/daily/${key}`

    return `/leaderboard/daily/${key}?league=${newLeague}`
  }

  useEffect(() => {
    setLastUpdated(data.lbLastUpdated ? diffInMins(data.lbLastUpdated) : 0)
  }, [data.lbLastUpdated])

  const start = 0 + (page - 1) * 100

  const globalIconPx = width <= 480 ? 36 : 55
  const flagIconHeightPx = width <= 480 ? 24 : 36
  const flagIconWidthPx = width <= 480 ? 40 : 60

  const thPx = width <= 480 ? 15 : 18

  const flagHeightPx = width <= 480 ? 14 : 18
  const flagWidthPx = width <= 480 ? 24 : 30

  return (
    <>
      <NextSeo
        title={`Daily War Leaderboard - ${region.name} | CWStats - Clash Royale`}
        description={`View the current daily leaderboard (${region.name}).`}
        openGraph={{
          title: `Daily War Leaderboard - ${region.name} | CWStats - Clash Royale`,
          description: `View the current daily leaderboard (${region.name}).`,
          images: [
            {
              url: `/assets/flags/${region.key.toLowerCase()}.png`,
              alt: "Region Icon",
            },
          ],
        }}
      />

      <Main>
        <HeaderDiv>
          <Header>Top {region.name} Daily Rankings</Header>
          <HeaderIcon
            key={region.key}
            src={`/assets/flags/${region.key.toLowerCase()}.png`}
            width={region.name === "Global" ? globalIconPx : flagIconWidthPx}
            height={region.name === "Global" ? globalIconPx : flagIconHeightPx}
            alt="Location"
          />
        </HeaderDiv>
        <ControlDiv>
          <LeftControlDiv>
            <ToggleDiv
              style={{
                borderBottom: `3px solid ${pink}`,
                marginBottom: "-3px",
              }}
            >
              Daily
            </ToggleDiv>
            <ToggleDiv onClick={() => router.push(`/leaderboard/war/${region.key}`)}>War</ToggleDiv>
            <RegionDropdown onClick={() => setIsModalOpen(true)}>
              {region.name}
              <IoCaretDown
                style={{
                  marginLeft: "0.75rem",
                }}
              />
            </RegionDropdown>

            <LeagueToggle
              id="All"
              href={navigateLeagues()}
              style={
                !league
                  ? {
                      backgroundColor: gray["50"],
                    }
                  : null
              }
            >
              All
            </LeagueToggle>
            <LeagueToggle
              id="5000"
              href={navigateLeagues("5000")}
              style={
                league === "5000"
                  ? {
                      backgroundColor: gray["50"],
                    }
                  : null
              }
            >
              5000+
            </LeagueToggle>
            <LeagueToggle
              id="4000"
              href={navigateLeagues("4000")}
              style={
                league === "4000"
                  ? {
                      backgroundColor: gray["50"],
                    }
                  : null
              }
            >
              4000
            </LeagueToggle>
          </LeftControlDiv>
          <RightControlDiv>
            <PaginationDiv onClick={decrementPage}>
              <IoCaretBack />
            </PaginationDiv>
            <PaginationDiv onClick={incrementPage}>
              <IoCaretForward />
            </PaginationDiv>
          </RightControlDiv>
        </ControlDiv>

        <InfoDiv>
          <LastUpdated>
            Last Updated:{" "}
            <span
              style={{
                color: pink,
              }}
            >
              {lastUpdated}m ago
            </span>
          </LastUpdated>
          <PageData>
            {page} of {totalPages || 1} ({data.dailyLbArr.length})
          </PageData>
        </InfoDiv>

        <ContentTable>
          <thead>
            <Row>
              <THead>#</THead>
              <THead />
              <THead />
              <THead />
              <THead>
                <GlobeIcon />
              </THead>
              <THead>
                <TrophiesIcon src="/assets/icons/cw-trophy.png" width={thPx} height={thPx} alt="Trophies" />
              </THead>
              <THead>
                <AtksIcon src="/assets/icons/decksRemaining.png" width={thPx} height={thPx} alt="Decks Remaining" />
              </THead>
              <THead />
            </Row>
          </thead>
          <tbody>
            {data.dailyLbArr.slice(start, start + 100).map((c, index) => {
              const badgeName = getClanBadgeFileName(c.badgeId, c.clanScore)
              const backgroundColor = index % 2 === 0 ? "#2e2f30" : gray["75"]

              return (
                <Row key={c.tag}>
                  <CenterCell
                    style={{
                      backgroundColor,
                    }}
                  >
                    {c.notRanked ? "NR" : index + 1 + start}
                  </CenterCell>
                  <Cell
                    style={{
                      backgroundColor,
                    }}
                  >
                    <ClanBadgeDiv>
                      <ClanBadge src={`/assets/badges/${badgeName}.png`} alt="Badge" fill unoptimized />
                    </ClanBadgeDiv>
                  </Cell>
                  <Cell
                    style={{
                      backgroundColor,
                    }}
                  >
                    <Name href={`/clan/${c?.tag?.substring(1)}/race`}>{c.name}</Name>
                  </Cell>
                  <Cell
                    style={{
                      backgroundColor,
                    }}
                  >
                    <Flag
                      src={`/assets/flags/${getCountryKeyById(c.location.id)}.png`}
                      height={flagHeightPx}
                      width={flagWidthPx}
                      alt="Flag"
                    />
                  </Cell>
                  <CenterCell
                    style={
                      c.rank === "N/A"
                        ? {
                            color: gray["50"],
                            backgroundColor,
                          }
                        : {
                            backgroundColor,
                          }
                    }
                  >{`${c.rank === "N/A" ? "" : "#"}${c.rank}`}</CenterCell>
                  <CenterCell
                    style={{
                      backgroundColor,
                    }}
                  >
                    {c.clanScore}
                  </CenterCell>
                  <CenterCell
                    style={{
                      backgroundColor,
                    }}
                  >
                    {c.decksRemaining}
                  </CenterCell>
                  <FameCell>{c.fameAvg.toFixed(2)}</FameCell>
                </Row>
              )
            })}
          </tbody>
        </ContentTable>

        {data.dailyLbArr.length > 0 && <NotRanked>*NR = Not Ranked</NotRanked>}

        {!isTracked ? <NotTracked /> : null}
      </Main>

      <LocationsModal
        setIsModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        locations={Locations.map((l) => ({
          name: l.name,
          url: `/leaderboard/daily/${l.key}${league ? `?league=${league}` : ""}`,
        }))}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const { location: key, league } = context.query
  const region = getRegionByKey(key)

  if (!region) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    }
  }

  const { id } = region
  const minTrophies = Number(league) || null
  const maxTrophies = league === "4000" ? 4999 : null

  const client = await clientPromise
  const db = client.db("General")
  const dailyLb = db.collection("Daily Clan Leaderboard")
  const statistics = db.collection("Statistics")

  const dailyLbQuery =
    id === "global"
      ? {}
      : {
          "location.id": id,
        }

  const [dailyLbArr, statsData] = await Promise.all([
    dailyLb
      .find({
        ...dailyLbQuery,
        clanScore: {
          $gte: Number(minTrophies) || 0,
          $lte: Number(maxTrophies) || 10000,
        },
      })
      .sort({
        notRanked: 1,
        fameAvg: -1,
        rank: 1,
        clanScore: -1,
      })
      .limit(0)
      .toArray(),
    statistics.findOne(),
  ])

  return {
    props: {
      region,
      data: {
        dailyLbArr: JSON.parse(JSON.stringify(dailyLbArr)),
        lbLastUpdated: statsData.lbLastUpdated,
      },
    },
  }
}
