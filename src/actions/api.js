"use server"

import { HOST } from "@/static/constants"

import { handleAPIFailure, handleAPISuccess } from "./server"

const BASE_URL = "https://api.cwstats.com"
const { INTERNAL_API_KEY } = process.env

export async function getPlayersByQuery(query, limit = 5) {
  const options = { cache: "no-store" }
  const players = await fetch(`${HOST}/api/search-players?q=${encodeURIComponent(query)}&limit=${limit}`, options)

  return players.json()
}

export const getDailyLeaderboard = async ({ key, limit, maxTrophies, minTrophies }) => {
  const params = new URLSearchParams()

  if (key && key.toLowerCase() !== "global") params.append("key", key)
  if (limit) params.append("limit", limit)
  if (maxTrophies) params.append("maxTrophies", maxTrophies)
  if (minTrophies) params.append("minTrophies", minTrophies)

  return fetch(`${BASE_URL}/leaderboard/daily?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)
}

export async function getWeeklyStats() {
  const options = {
    next: { revalidate: 10800 }, // 3 hours in seconds
  }

  const stats = await fetch(`${HOST}/api/weekly-stats`, options)

  return stats.json()
}
