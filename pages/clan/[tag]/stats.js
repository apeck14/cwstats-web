import { redirect } from "next/dist/server/api-utils"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"

import ClanHeader from "../../../components/Clan/Header"
import SubNav from "../../../components/Clan/SubNav"
import ComingSoon from "../../../components/ComingSoon"
import clientPromise from "../../../lib/mongodb"
import { getClanBadgeFileName } from "../../../utils/files"
import { formatTag, getCRErrorUrl, handleSCResponse } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"
import { addClan } from "../../api/add/clan"
import { authOptions } from "../../api/auth/[...nextauth]"

export default function ClanStats({ clan, saved, badgeName }) {
  return (
    <>
      <NextSeo
        title={`${clan.name} | Home - CWStats`}
        description={clan.description}
        openGraph={{
          title: `${clan.name} | Home - CWStats`,
          description: clan.description,
          images: [
            {
              url: `/assets/badges/${badgeName}.png`,
              alt: "Clan Badge",
            },
          ],
        }}
      />

      <ClanHeader saved={saved} badgeName={badgeName} clan={clan} />

      <SubNav />
      <ComingSoon />
    </>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const { tag } = params

  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const promises = [fetchClan(formatTag(tag, false))]

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

    const [clanResp, userResp] = await Promise.all(promises)

    const clan = await handleSCResponse(clanResp)

    let saved = false

    if (userResp) saved = !!(userResp.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)
    addClan({ name: clan.name, tag: clan.tag, badge: badgeName })

    return {
      props: {
        clan,
        saved,
        badgeName,
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
