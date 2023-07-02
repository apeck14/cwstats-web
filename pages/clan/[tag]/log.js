import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import ClanHeader from "../../../components/Clan/Header"
import ClanLogItem from "../../../components/Clan/Log/ClanLog"
import SubNav from "../../../components/Clan/SubNav"
import ClanLogsOverview from "../../../components/Tables/ClanLogsOverview"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import {
  formatTag,
  getCRErrorUrl,
  handleSCResponse,
  redirect,
} from "../../../utils/functions"
import { fetchClan, fetchLog } from "../../../utils/services"
import { addClan } from "../../api/add/clan"
import { authOptions } from "../../api/auth/[...nextauth]"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-top: 2rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

export default function ClanLog({ clan, log, saved, badgeName }) {
  return (
    <>
      <NextSeo
        title={`${clan.name} | Race Log - CWStats`}
        description={clan.description}
        openGraph={{
          title: `${clan.name} | Race Log - CWStats`,
          description: clan.description,
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

      <ClanHeader clan={clan} badgeName={badgeName} saved={saved} />

      <SubNav />

      <ClanLogsOverview clanTag={clan.tag} log={log} />

      <Header>Logs</Header>

      {log.map((w) => {
        const clanInWeek = w.standings.find((c) => c.clan.tag === clan.tag)

        return <ClanLogItem week={w} clan={clanInWeek} />
      })}
    </>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const { tag } = params
  const formattedTag = formatTag(tag, false)

  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const promises = [fetchClan(formattedTag), fetchLog(formattedTag)]

    const session = await getServerSession(req, res, authOptions)

    if (session) {
      const client = await clientPromise
      const db = client.db("General")
      const accounts = db.collection("accounts")
      const linkedAccounts = db.collection("Linked Accounts")

      const userId = new ObjectId(session.user.id)

      const user = await accounts.findOne({
        userId,
      })

      promises.push(
        linkedAccounts.findOne({
          discordID: user.providerAccountId,
        })
      )
    }

    const [clanResp, logResp, userResp] = await Promise.all(promises)

    let clan = {}
    let log = []

    // not in an active race
    if (logResp.status === 404) {
      clan = await handleSCResponse(clanResp)
    } else {
      const [clanData, logData] = await Promise.all([
        handleSCResponse(clanResp),
        handleSCResponse(logResp),
      ])

      clan = clanData
      log = logData
    }

    let saved

    if (userResp) saved = !!(userResp?.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)
    addClan({ name: clan.name, tag: clan.tag, badge: badgeName })

    return {
      props: {
        clan: {
          name: clan.name,
          tag: clan.tag,
          clanScore: clan.clanScore,
          clanWarTrophies: clan.clanWarTrophies,
        },
        log,
        saved, // not sure :)
        badgeName,
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
