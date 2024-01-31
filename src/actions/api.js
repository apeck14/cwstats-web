"use server"

/* eslint-disable import/prefer-default-export */
// import { headers } from "next/headers"

const HOST = process.env.NEXTAUTH_URL

export async function getLinkedAccount() {
  const options = { cache: "no-store" }
  const linkedAccount = await fetch(`${HOST}/api/user`, options)

  return linkedAccount.json()
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
