/* eslint-disable import/prefer-default-export */
/* eslint-disable perfectionist/sort-objects */
import { NextResponse } from "next/server"

import client from "@/lib/mongodb"
import locations from "@/static/locations"

// /api/leaderboard/:id
export async function GET(req) {
  const key = req.nextUrl.searchParams.get("key")
  const limit = req.nextUrl.searchParams.get("limit")
  const maxTrophies = req.nextUrl.searchParams.get("maxTrophies")
  const minTrophies = req.nextUrl.searchParams.get("minTrophies")

  try {
    const formattedKey = key.toLowerCase()
    const location = locations.find((l) => l.key.toLowerCase() === formattedKey)

    if (!location) {
      return NextResponse.json({ message: "Region not found." }, { status: 404 })
    }

    const db = client.db("General")
    const dailyLb = db.collection("Daily Clan Leaderboard")
    const statistics = db.collection("Statistics")

    const dailyLbQuery =
      key === "global"
        ? {}
        : {
            "location.id": location.id,
          }

    const limitQuery = Number(limit) || 0

    const [dailyLbArr, statsData] = await Promise.all([
      dailyLb
        .find({
          ...dailyLbQuery,
          clanScore: {
            $gte: Number(minTrophies) || 0,
            $lte: Number(maxTrophies) || 10000,
          },
        })
        .sort({
          notRanked: 1,
          fameAvg: -1,
          rank: 1,
          clanScore: -1,
        })
        .limit(limitQuery)
        .toArray(),
      statistics.findOne(),
    ])

    const lbLastUpdated = statsData?.lbLastUpdated ? new Date(statsData.lbLastUpdated) : new Date()

    return NextResponse.json({ dailyLbArr, lbLastUpdated }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: err?.message }, { status: 500 })
  }
}
