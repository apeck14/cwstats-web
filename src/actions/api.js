"use server"

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { Logger } from "next-axiom"

import { authOptions } from "../app/api/auth/[...nextauth]/route"
import clientPromise from "../lib/mongodb"

const HOST = process.env.NEXTAUTH_URL

export async function getLinkedAccount() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) return JSON.parse(JSON.stringify({ message: "Not logged in.", status: 403 }))

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const linkedAccounts = db.collection("Linked Accounts")

    const userId = new ObjectId(session?.user?.id)

    const user = await accounts.findOne({
      userId,
    })

    if (!user) return JSON.parse(JSON.stringify({ status: 404 }))

    const linkedAccount = await linkedAccounts.findOne({
      discordID: user.providerAccountId,
    })

    if (!linkedAccount) return JSON.parse(JSON.stringify({ status: 404 }))

    return JSON.parse(JSON.stringify({ success: true, ...linkedAccount, status: 200 }))
  } catch (err) {
    const log = new Logger()
    log.warn("getLinkedAccount Error", err)

    return { message: err.message, status: 500 }
  }
}

export async function getPlayersByQuery(query, limit = 5) {
  const options = { cache: "no-store" }
  const players = await fetch(`${HOST}/api/search-players?q=${encodeURIComponent(query)}&limit=${limit}`, options)

  return players.json()
}

export async function getDailyLeaderboard({ key, limit, maxTrophies, minTrophies }) {
  const options = { cache: "no-store" }

  const leaderboard = await fetch(
    `${HOST}/api/leaderboard/?key=${encodeURIComponent(key)}&limit=${limit}&maxTrophies=${maxTrophies}&minTrophies=${minTrophies}`,
    options,
  )

  return leaderboard.json()
}
