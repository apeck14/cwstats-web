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
import { authOptions } from "../../api/auth/[...nextauth]"

const Header = styled.h2`
  color: ${gray["0"]};
  margin-top: 2rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

export default function ClanLog({ badgeName, clan, log, saved }) {
  return (
    <>
      <NextSeo
        description={clan.description}
        openGraph={{
          description: clan.description,
          images: [
            {
              alt: "Clan Badge",
              url: `/assets/badges/${getClanBadgeFileName(
                clan.badgeId,
                clan.clanWarTrophies
              )}.png`,
            },
          ],
          title: `${clan.name} ${clan.tag} | Race Log - CWStats`,
        }}
        title={`${clan.name} ${clan.tag} | Race Log - CWStats`}
      />

      <ClanHeader badgeName={badgeName} clan={clan} saved={saved} />

      <SubNav />

      <ClanLogsOverview clanTag={clan.tag} log={log} />

      <Header>Logs</Header>

      {log.map((w) => {
        const clanInWeek = w.standings.find((c) => c.clan.tag === clan.tag)

        return <ClanLogItem clan={clanInWeek} week={w} />
      })}
    </>
  )
}

export async function getServerSideProps({ params, req, res }) {
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

    if (userResp) saved = (userResp?.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

    return {
      props: {
        badgeName,
        clan: {
          clanScore: clan.clanScore,
          clanWarTrophies: clan.clanWarTrophies,
          name: clan.name,
          tag: clan.tag,
        },
        log,
        saved: !!saved, // not sure :)
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
