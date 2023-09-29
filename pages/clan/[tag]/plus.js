import groupBy from "lodash/groupBy"
import { redirect } from "next/dist/server/api-utils"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import { useState } from "react"
import styled from "styled-components"

import ClanHeader from "../../../components/Clan/Header"
import DailyAvgGraph from "../../../components/Clan/Plus/dailyAverageGraph"
import WeekCard from "../../../components/Clan/Plus/WeekCard"
import SubNav from "../../../components/Clan/SubNav"
import ComingSoon from "../../../components/ComingSoon"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import { formatTag, getCRErrorUrl, handleSCResponse } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Content = styled.div`
  margin: 1rem 0;
`

const GraphContainer = styled.div`
  height: 28rem;
  width: 100%;

  @media (max-width: 480px) {
    height: 20rem;
  }
`

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }
`

const NoData = styled.p`
  color: ${gray["50"]};
  margin: 0 auto;
  font-size: 1.25rem;
`

export default function ClanStats({ badgeName, clan, plus, saved }) {
  if (!plus) return <ComingSoon />

  const WEEK_KEYS = Object.keys(plus.dailyAverages)
  const MOST_RECENT_WEEK = Number(WEEK_KEYS[WEEK_KEYS.length - 1]) || 0
  console.log(MOST_RECENT_WEEK)
  const MOST_RECENT_DAY =
    WEEK_KEYS.length === 0
      ? 0
      : plus.dailyAverages[MOST_RECENT_WEEK][plus.dailyAverages[MOST_RECENT_WEEK].length - 1].day
  const NO_DATA = MOST_RECENT_WEEK === 0 && MOST_RECENT_DAY === 0

  const [graphWeek, setGraphWeek] = useState(MOST_RECENT_WEEK) // 1, 2, 3, 4
  const [graphDay, setGraphDay] = useState(MOST_RECENT_DAY) // -1, 1, 2, 3, 4

  const graphData = plus.dailyAverages[graphWeek]?.filter((a) => {
    if (a.fameAvg <= 0) return false
    if (graphDay === -1 && a.week === graphWeek) return true
    if (a.day !== graphDay) return false

    return true
  })

  return (
    <>
      <NextSeo
        description={clan.description}
        openGraph={{
          description: clan.description,
          images: [
            {
              alt: "Clan Badge",
              url: `/assets/badges/${badgeName}.png`,
            },
          ],
          title: `${clan.name} ${clan.tag} | CWStats+ - CWStats`,
        }}
        title={`${clan.name} ${clan.tag} | CWStats+ - CWStats`}
      />

      <ClanHeader badgeName={badgeName} clan={clan} saved={saved} />

      <SubNav />

      {plus ? (
        <Content>
          <GraphContainer>
            <DailyAvgGraph
              data={graphData || []}
              title={
                NO_DATA ? "Daily Averages" : `Week ${graphWeek} ${graphDay === -1 ? "" : `Day ${graphDay}`} Averages`
              }
            />
          </GraphContainer>
          <Cards>
            {NO_DATA ? (
              <NoData>No data yet!</NoData>
            ) : (
              WEEK_KEYS.map((w) => {
                const weekNum = Number(w)
                return (
                  <WeekCard
                    data={plus.dailyAverages[weekNum]}
                    graphDay={graphDay}
                    graphWeek={graphWeek}
                    key={weekNum}
                    setGraphDay={setGraphDay}
                    setGraphWeek={setGraphWeek}
                    weekNum={weekNum}
                  />
                )
              })
            )}
          </Cards>
        </Content>
      ) : (
        <ComingSoon />
      )}
    </>
  )
}

export async function getServerSideProps({ params, req, res }) {
  const { tag } = params

  try {
    const client = await clientPromise
    const db = client.db("General")
    const CWStatsPlus = db.collection("CWStats+")

    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const promises = [fetchClan(formatTag(tag)), CWStatsPlus.findOne({ tag: formatTag(tag, true) })]

    const session = await getServerSession(req, res, authOptions)

    if (session) {
      const accounts = db.collection("accounts")
      const linkedAccounts = db.collection("Linked Accounts")

      const userId = new ObjectId(session.user.id)

      const user = await accounts.findOne({
        userId,
      })

      promises.push(
        linkedAccounts.findOne({
          discordID: user.providerAccountId,
        }),
      )
    }

    const [clanResp, plus, userResp] = await Promise.all(promises)

    const clan = await handleSCResponse(clanResp)

    let saved = false

    if (userResp) saved = !!(userResp.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

    const props = {
      badgeName,
      clan,
      saved,
    }

    if (plus) props.plus = { dailyAverages: groupBy(plus.dailyAverages, "week") }

    return { props }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
