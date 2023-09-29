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
  "@media (max-width: 1024px)": {
    width: "100%",
  },
  "@media (max-width: 1200px)": {
    width: "80%",
  },

  margin: "0 auto",

  width: "70rem",
})

const HeaderDiv = styled.div({
  "@media (max-width: 480px)": {
    padding: "0.75rem",
  },
  alignItems: "center",
  // eslint-disable-next-line no-dupe-keys
  background: `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,
  display: "flex",
  justifyContent: "space-between",

  padding: "2rem",
})

const Header = styled.h1({
  "@media (max-width: 1024px)": {
    fontSize: "2rem",
  },
  "@media (max-width: 400px)": {
    fontSize: "0.9rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "1.15rem",
  },

  color: gray["0"],

  fontSize: "2.5rem",
})

const HeaderIcon = styled(Image)({})

const ControlDiv = styled.div({
  "@media (max-width: 480px)": {
    height: "2rem",
  },
  backgroundColor: gray["100"],
  display: "flex",
  height: "2.25rem",

  justifyContent: "space-between",
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
  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.6rem",
  },
  "&:hover": {
    cursor: "pointer",
  },
  alignItems: "center",

  display: "flex",

  justifyContent: "center",

  padding: "1rem",
})

const PaginationDiv = styled.div({
  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.8rem",
    padding: "0.5rem",
  },
  "&:hover": {
    cursor: "pointer",
    filter: "brightness(80%)",
  },
  alignItems: "center",
  backgroundColor: orange,
  color: gray["0"],

  display: "flex",

  justifyContent: "center",

  padding: "1rem",
})

const RegionDropdown = styled.div({
  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.6rem",
    padding: "0.6rem",
  },
  "&:hover": {
    color: gray["25"],
    cursor: "pointer",
  },
  alignItems: "center",

  backgroundColor: gray["75"],

  display: "flex",

  padding: "1rem",
})

const LeagueToggle = styled(Link)({
  "@media (max-width: 1024px)": {
    padding: "0.75rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.6rem",
  },
  "&:hover": {
    color: gray["25"],
    cursor: "pointer",
  },
  alignItems: "center",
  color: gray["0"],

  display: "flex",

  padding: "1rem",

  textDecoration: "none",
})

const InfoDiv = styled.div({
  "@media (max-width: 1024px)": {
    padding: "0 0.5rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.75rem",
    margin: "1rem 0",
  },
  color: gray["25"],
  display: "flex",

  justifyContent: "space-between",

  margin: "1.5rem 0",
})

const LastUpdated = styled.p({})

const PageData = styled.p({})

const ContentTable = styled.table({
  borderCollapse: "collapse",
  marginBottom: "1rem",
  width: "100%",
})

const Row = styled.tr({
  color: gray["0"],
})

const THead = styled.th({
  "@media (max-width: 480px)": {
    padding: "0.25rem 0.4rem",
  },
  borderBottom: `2px solid ${pink}`,
  color: gray["25"],

  padding: "0.5rem 0.75rem",
})

const Cell = styled.td({
  "@media (max-width: 1024px)": {
    fontSize: "0.8rem",
    padding: "0.5rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.4rem",
  },

  borderTop: `1px solid ${gray["50"]}`,

  padding: "0.75rem",
})

const Name = styled(Link)({
  "@media (max-width: 480px)": {
    fontSize: "0.8rem",
  },
  "&:hover": {
    color: pink,
    cursor: "pointer",
  },

  color: gray["0"],

  textDecoration: "none",
})

const CenterCell = styled(Cell)({
  textAlign: "center",
})

const FameCell = styled(Cell)({
  "@media (max-width: 1024px)": {
    fontSize: "0.85rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
    padding: "0.5rem",
  },
  backgroundColor: gray["50"],

  fontSize: "1.05rem",

  textAlign: "center",
})

const ClanBadgeDiv = styled.div({
  "@media (max-width: 480px)": {
    height: "1.3rem",
    width: "0.95rem",
  },
  height: "2rem",
  overflow: "hidden",
  position: "relative",

  width: "1.4rem",
})

const ClanBadge = styled(Image)({
  height: "auto",
  maxHeight: "100%",
  maxWidth: "100%",
  objectFit: "contain",
  width: "auto",
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

export default function Leaderboard({ data, region }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const [page, setPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { league, location: key } = router.query

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
        description={`View the current daily leaderboard (${region.name}).`}
        openGraph={{
          description: `View the current daily leaderboard (${region.name}).`,
          images: [
            {
              alt: "Region Icon",
              url: `/assets/flags/${region.key.toLowerCase()}.png`,
            },
          ],
          title: `Daily War Leaderboard - ${region.name} | CWStats - Clash Royale`,
        }}
        title={`Daily War Leaderboard - ${region.name} | CWStats - Clash Royale`}
      />

      <Main>
        <HeaderDiv>
          <Header>Top {region.name} Daily Rankings</Header>
          <HeaderIcon
            alt="Location"
            height={region.name === "Global" ? globalIconPx : flagIconHeightPx}
            key={region.key}
            src={`/assets/flags/${region.key.toLowerCase()}.png`}
            width={region.name === "Global" ? globalIconPx : flagIconWidthPx}
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
              href={navigateLeagues()}
              id="All"
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
              href={navigateLeagues("5000")}
              id="5000"
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
              href={navigateLeagues("4000")}
              id="4000"
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
                <TrophiesIcon alt="Trophies" height={thPx} src="/assets/icons/cw-trophy.png" width={thPx} />
              </THead>
              <THead>
                <AtksIcon alt="Decks Remaining" height={thPx} src="/assets/icons/decksRemaining.png" width={thPx} />
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
                      <ClanBadge alt="Badge" fill src={`/assets/badges/${badgeName}.png`} />
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
                      alt="Flag"
                      height={flagHeightPx}
                      src={`/assets/flags/${getCountryKeyById(c.location.id)}.png`}
                      width={flagWidthPx}
                    />
                  </Cell>
                  <CenterCell
                    style={
                      c.rank === "N/A"
                        ? {
                            backgroundColor,
                            color: gray["50"],
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
        isOpen={isModalOpen}
        locations={Locations.map((l) => ({
          name: l.name,
          url: `/leaderboard/daily/${l.key}${league ? `?league=${league}` : ""}`,
        }))}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const { league, location: key } = context.query
  const region = getRegionByKey(key)

  if (!region) {
    return {
      props: {},
      redirect: {
        destination: "/404",
        permanent: false,
      },
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
        clanScore: -1,
        fameAvg: -1,
        notRanked: 1,
        rank: 1,
      })
      .limit(0)
      .toArray(),
    statistics.findOne(),
  ])

  return {
    props: {
      data: {
        dailyLbArr: JSON.parse(JSON.stringify(dailyLbArr)),
        lbLastUpdated: statsData.lbLastUpdated,
      },
      region,
    },
  }
}
