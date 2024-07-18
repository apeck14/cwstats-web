import chunk from "lodash/chunk"
import { NextResponse } from "next/server"
import { Logger } from "next-axiom"

import { getAllDailyLbClans, getCurrentSeason } from "@/actions/api"
import { getRace, getWarLeaderboard } from "@/actions/supercell"
import { getAllPlusClans } from "@/actions/upgrade"
import { getAvgFame } from "@/lib/functions/race"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const maxDuration = 240

const IS_DEV = process.env.NODE_ENV === "development"

const getMinAttackThreshold = (clans) => {
  // remove clans in training day
  const sortedDecksUsed = clans
    .filter((c) => !c.isTraining)
    .map((c) => 200 - c.decksRemaining)
    .sort((a, b) => b - a)

  if (sortedDecksUsed.length === 0) return 0

  const midIndex = Math.floor(sortedDecksUsed.length / 2)
  const MEDIAN =
    sortedDecksUsed.length % 2 === 0
      ? (sortedDecksUsed[midIndex - 1] + sortedDecksUsed[midIndex]) / 2
      : sortedDecksUsed[midIndex]

  if (MEDIAN <= 25) return 0
  if (MEDIAN <= 50) return Math.round(MEDIAN * 0.1)
  if (MEDIAN <= 100) return Math.round(MEDIAN * 0.15)
  if (MEDIAN <= 150) return Math.round(MEDIAN * 0.25)
  return Math.round(MEDIAN * 0.4)
}

const getLastHourAvg = ({ attacksLastHour, attacksNow, avgLastHour, avgNow }) => {
  const sumLastHour = attacksLastHour * avgLastHour
  const sumNow = attacksNow * avgNow

  const attacksLastHourDifference = attacksNow - attacksLastHour
  if (attacksLastHourDifference === 0) {
    return avgNow
  }

  const avgBetweenLastHourAndNow = (sumNow - sumLastHour) / attacksLastHourDifference

  return avgBetweenLastHourAndNow
}

/**
 * - Update daily leaderboards for all tracked regions
 * - Update hourly averages for all CWStats+ clans
 */

export async function GET(req) {
  const log = new Logger()

  log.info("Updating daily leaderboard and hourly fame(s)...")

  try {
    // authenticate job
    const authHeader = req.headers.get("Authorization")
    if (!IS_DEV && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      log.error("Unauthorized Job", { authHeader, IS_DEV })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // all tags from tracked regions / all CWStats+ clans / top 1000 lb to set global rank, if applicable
    const [clansToCheckRaces, plusClans, { data: allGlobalRankedClans, error: allGlobalRankedError }] =
      await Promise.all([getAllDailyLbClans(), getAllPlusClans(), getWarLeaderboard("global")])

    if (allGlobalRankedError) {
      throw new Error(allGlobalRankedError)
    }

    const plusTags = clansToCheckRaces.filter((c) => c.plus).map((c) => c.tag)

    const now = new Date()
    const minutes = now.getUTCMinutes()
    const addHourlyAverages = minutes < 30 - minutes

    const hourlyAvgEntries = [] // ["#ABC12345", { $push: { ... }}]
    const clanAverages = []
    let ignoreThreshold = false
    let curSeason

    const chunkedClansToCheckRaces = chunk(clansToCheckRaces, 5)

    for (const group of chunkedClansToCheckRaces) {
      // filter clans in trio in clanAverages
      const clansToCheckRacesFromGroup = group.filter((cl) => !clanAverages.find((cla) => cla.tag === cl.tag))

      const racePromises = clansToCheckRacesFromGroup.map((c) => getRace(c.tag))
      const races = await Promise.all(racePromises)

      for (const { data: race, error } of races) {
        if (error || !race) continue

        const isColosseum = race.periodType === "colosseum"
        const dayOfWeek = race.periodIndex % 7 // 0-6 (0,1,2 TRAINING, 3,4,5,6 BATTLE)
        const isTraining = race.periodType === "training"
        const isMatchmaking = race.state === "matchmaking"

        if (isColosseum && dayOfWeek > 3) ignoreThreshold = true

        for (const cl of race.clans) {
          const isPlus = plusTags.includes(cl.tag)

          // if CWStats+, add daily average to tracking
          if (
            addHourlyAverages &&
            isPlus &&
            !isTraining &&
            !hourlyAvgEntries.find((c) => c[0] === cl.tag) &&
            !isMatchmaking
          ) {
            const firstDayOfNewSeason = race.periodIndex === 0 && dayOfWeek === 3

            if (!curSeason) {
              curSeason = await getCurrentSeason(allGlobalRankedClans, race.sectionIndex)
            }

            if (curSeason) {
              const query = {}

              if (firstDayOfNewSeason) {
                // remove any season not from last 3 full seasons
                query.$pull = {
                  hourlyAverages: {
                    season: {
                      $nin: [curSeason, curSeason - 1, curSeason - 2, curSeason - 3],
                    },
                  },
                }
              }

              // if col, then total attacks used, else attacks used today
              const attacksProp = isColosseum ? "decksUsed" : "decksUsedToday"
              const attacksCompleted = cl.participants.reduce((sum, p) => sum + p[attacksProp], 0)

              const avg = getAvgFame(cl, isColosseum, dayOfWeek)

              // add new entry
              query.$push = {
                hourlyAverages: {
                  attacksCompleted,
                  avg,
                  day: dayOfWeek - 2,
                  season: curSeason,
                  timestamp: now,
                  week: race.sectionIndex + 1,
                },
              }

              // if last document has attacksCompleted: calculate lastHourAvg and add to query
              const { hourlyAverages } = plusClans.find((e) => e.tag === cl.tag) || {}

              if (hourlyAverages?.length) {
                const lastEntry = hourlyAverages[hourlyAverages.length - 1]
                const { day, season, week } = query.$push.hourlyAverages

                const lastEntryIsSameDay =
                  lastEntry.season === season && lastEntry.week === week && lastEntry.day === day

                let lastHourAvg

                if (lastEntryIsSameDay && lastEntry.attacksCompleted === attacksCompleted) lastHourAvg = 0
                else if (lastEntryIsSameDay || (isColosseum && dayOfWeek > 3))
                  lastHourAvg = getLastHourAvg({
                    attacksLastHour: lastEntry.attacksCompleted,
                    attacksNow: attacksCompleted,
                    avgLastHour: lastEntry.avg,
                    avgNow: avg,
                  })
                else lastHourAvg = avg

                query.$push.hourlyAverages = {
                  ...query.$push.hourlyAverages,
                  lastHourAvg,
                }
              }

              hourlyAvgEntries.push([cl.tag, query])
            }
          }

          if (cl.clanScore < 4000) continue

          const clan = clanAverages.find((c) => c.tag === cl.tag)
          if (clan) continue

          const globalClanRank = allGlobalRankedClans.findIndex((cla) => cla.tag === cl.tag)

          const fameAvg = getAvgFame(cl, isColosseum, dayOfWeek)
          const decksRemaining = 200 - cl.participants.reduce((a, b) => a + b.decksUsedToday, 0)

          const notRankedGlobally = globalClanRank === -1
          const movementPts = isColosseum ? cl.periodPoints : cl.fame
          const crossedFinishLine = !isColosseum && movementPts >= 10000

          const shared = {
            crossedFinishLine,
            decksRemaining,
            fameAvg,
            isTraining,
            notRanked: crossedFinishLine, // default to this value, changed below based on condition
          }

          const curClan = group.find((c) => c.tag === cl.tag)

          if (cl.tag === curClan?.tag) {
            clanAverages.push({
              ...curClan,
              ...shared,
              rank: notRankedGlobally ? "N/A" : globalClanRank + 1,
            })

            continue
          }

          if (notRankedGlobally) continue

          clanAverages.push({
            ...allGlobalRankedClans[globalClanRank],
            ...shared,
            rank: globalClanRank + 1,
          })
        }
      }
    }

    if (!ignoreThreshold) {
      const MIN_ATKS_USED_THRESHOLD = getMinAttackThreshold(clanAverages)

      // add notRanked = true to all clans under threshold
      for (const c of clanAverages) {
        if (!c.notRanked && 200 - c.decksRemaining < MIN_ATKS_USED_THRESHOLD) c.notRanked = true
      }
    }

    // update all hourly averages
    if (!IS_DEV) {
      const client = await clientPromise
      const db = client.db("General")
      const dailyLb = db.collection("Daily Clan Leaderboard")
      const statistics = db.collection("Statistics")
      const CWStatsPlus = db.collection("CWStats+")

      for (const entry of hourlyAvgEntries) {
        const [tag, query] = entry
        CWStatsPlus.updateOne({ tag }, query)
      }

      if (clanAverages.length > 0) {
        await dailyLb.deleteMany({})
        statistics.updateOne(
          {},
          {
            $set: {
              lbLastUpdated: Date.now(),
            },
          },
        )
        dailyLb.insertMany(clanAverages)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    log.error("Update LB & Hourly Fame Error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
