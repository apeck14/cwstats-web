import Image from "next/image"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useState } from "react"
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs"
import { IoCaretBack, IoCaretDown, IoCaretForward } from "react-icons/io5"
import styled from "styled-components"

import LocationsModal from "../../../components/Modals/Locations"
import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import Locations from "../../../public/static/locations"
import { getClanBadgeFileName, getCountryKeyById, getRegionByKey } from "../../../utils/files"
import { getCRErrorUrl, handleSCResponse } from "../../../utils/functions"
import { getWarLeaderboard } from "../../../utils/services"

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
    padding: "0.8rem",
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

  justifyContent: "flex-end",

  margin: "1.5rem 0",
})

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

const Name = styled.span({
  "@media (max-width: 480px)": {
    fontSize: "0.8rem",
  },

  "&:hover": {
    color: pink,
    cursor: "pointer",
  },
})

const CenterCell = styled(Cell)({
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

const TrophiesIcon = styled(Image)({})

const DownArrow = styled(BsArrowDownShort)({
  color: "red",
  fontSize: "1.1rem",
})

const UpArrow = styled(BsArrowUpShort)({
  color: "green",
  fontSize: "1.1rem",
})

const RankDiv = styled.div({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
})

export default function Leaderboard({ data, region }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalPages = Math.floor(data.length / 100) + (data.length % 100 === 0 ? 0 : 1)

  const incrementPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const decrementPage = () => {
    if (page > 1) setPage(page - 1)
  }

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
        description={`View the current war leaderboard (${region.name}).`}
        openGraph={{
          description: `View the current war leaderboard (${region.name}).`,
          images: [
            {
              alt: "Region Icon",
              url: `/assets/flags/${region.key.toLowerCase()}.png`,
            },
          ],
          title: `War Leaderboard - ${region.name} | CWStats - Clash Royale`,
        }}
        title={`War Leaderboard - ${region.name} | CWStats - Clash Royale`}
      />

      <Main>
        <HeaderDiv>
          <Header>Top {region.name} War Rankings</Header>
          <HeaderIcon
            alt="Location"
            height={region.name === "Global" ? globalIconPx : flagIconHeightPx}
            key={region.key}
            src={`/assets/flags/${region?.key?.toLowerCase()}.png`}
            width={region.name === "Global" ? globalIconPx : flagIconWidthPx}
          />
        </HeaderDiv>
        <ControlDiv>
          <LeftControlDiv>
            <ToggleDiv onClick={() => router.push(`/leaderboard/daily/${region.key}`)}>Daily</ToggleDiv>
            <ToggleDiv
              style={{
                borderBottom: `3px solid ${pink}`,
                marginBottom: "-3px",
              }}
            >
              War
            </ToggleDiv>
            <RegionDropdown onClick={() => setIsModalOpen(true)}>
              {region.name}
              <IoCaretDown
                style={{
                  marginLeft: "0.75rem",
                }}
              />
            </RegionDropdown>
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
          <PageData>
            {page} of {totalPages} ({data.length})
          </PageData>
        </InfoDiv>

        <ContentTable>
          <thead>
            <Row>
              <THead>#</THead>
              <THead />
              <THead />
              <THead />
              <THead />
              <THead>
                <TrophiesIcon alt="Trophies" height={thPx} src="/assets/icons/cw-trophy.png" width={thPx} />
              </THead>
            </Row>
          </thead>
          <tbody>
            {data.slice(start, start + 100).map((c, index) => {
              const badgeName = getClanBadgeFileName(c.badgeId, c.clanScore)
              const rankDiff = c.previousRank - c.rank
              const backgroundColor = index % 2 === 0 ? "#2e2f30" : gray["75"]

              const rankContent = () => {
                if (c.previousRank === -1 || rankDiff === 0) {
                  return (
                    <RankDiv
                      style={{
                        color: gray["50"],
                      }}
                    >
                      --
                    </RankDiv>
                  )
                }
                if (rankDiff > 0)
                  return (
                    <RankDiv>
                      <UpArrow />
                      {rankDiff}
                    </RankDiv>
                  )

                return (
                  <RankDiv>
                    <DownArrow />
                    {rankDiff * -1}
                  </RankDiv>
                )
              }

              return (
                <Row key={c.tag}>
                  <CenterCell
                    style={{
                      backgroundColor,
                    }}
                  >
                    {c.rank}
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
                    <Name onClick={() => router.push(`/clan/${c.tag.substring(1)}`)}>{c.name}</Name>
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
                    style={{
                      backgroundColor,
                    }}
                  >
                    {rankContent()}
                  </CenterCell>
                  <CenterCell
                    style={{
                      backgroundColor,
                    }}
                  >
                    {c.clanScore}
                  </CenterCell>
                </Row>
              )
            })}
          </tbody>
        </ContentTable>
      </Main>

      <LocationsModal
        isOpen={isModalOpen}
        locations={Locations.map((l) => ({
          name: l.name,
          url: `/leaderboard/war/${l.key}`,
        }))}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const { location: key } = context.query
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

  try {
    const res = await getWarLeaderboard(region.id)
    const data = await handleSCResponse(res)

    return {
      props: {
        data,
        region,
      },
    }
  } catch (err) {
    return {
      props: {},
      redirect: {
        destination: getCRErrorUrl(err),
        permanent: false,
      },
    }
  }
}
