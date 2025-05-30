"use server"

import { HOST } from "@/static/constants"

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

export async function getWeeklyStats() {
  const options = {
    next: { revalidate: 10800 }, // 3 hours in seconds
  }

  const stats = await fetch(`${HOST}/api/weekly-stats`, options)

  return stats.json()
}
