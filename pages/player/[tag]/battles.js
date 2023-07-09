import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"

import ComingSoon from "../../../components/ComingSoon"
import PlayerHeader from "../../../components/Player/Header"
import SubNav from "../../../components/Player/SubNav"
import clientPromise from "../../../lib/mongodb"
import { getArenaFileName, getClanBadgeFileName } from "../../../utils/files"
import {
  formatRole,
  formatTag,
  getCRErrorUrl,
  handleSCResponse,
  redirect,
} from "../../../utils/functions"
import { fetchClan, fetchPlayer } from "../../../utils/services"
import { addPlayer } from "../../api/add/player"
import { authOptions } from "../../api/auth/[...nextauth]"

export default function PlayerBattles({ saved, player }) {
  const arenaName = getArenaFileName(player.trophies)

  return (
    <>
      <NextSeo
        title={`${player.name} ${player.tag} | Battles - CWStats`}
        description="View advanced player stats, card levels, battle log, & more!"
        openGraph={{
          title: `${player.name} ${player.tag} | Battles - CWStats`,
          description: "View advanced player stats, card levels, battle log, & more!",
          images: [
            {
              url: `/assets/arenas/${arenaName}.png`,
              alt: "Clash Royale Ladder Arena",
            },
          ],
        }}
      />
      <PlayerHeader saved={saved} player={player} arenaName={arenaName} />
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

    const promises = [fetchPlayer(formatTag(tag, false))]

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

    const [playerResp, userResp] = await Promise.all(promises)

    const player = await handleSCResponse(playerResp)

    let clan = {}

    if (player?.clan?.tag) {
      const clanResp = await fetchClan(player.clan.tag.substring(1))
      clan = await handleSCResponse(clanResp)
    }

    let saved = false
    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

    if (userResp)
      saved = !!(userResp.savedPlayers || []).find((c) => c.tag === player.tag)

    addPlayer({ name: player.name, tag: player.tag, clanName: clan.name || "" })

    return {
      props: {
        saved,
        player: {
          ...player,
          role: formatRole(player.role),
          clan: {
            ...player.clan,
            badge: badgeName,
          },
        },
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
