"use server"

import { chunk } from "lodash"
import { Logger } from "next-axiom"

import { getDaysDiff, parseDate } from "@/lib/functions/date-time"
import clientPromise from "@/lib/mongodb"
import { HOST } from "@/static/constants"
import locations from "@/static/locations"

import { getClan, getRaceLog, getWarLeaderboard } from "./supercell"
import { getAllPlusClans, sendPlusWebhookEmbed } from "./upgrade"

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

export async function getAllDailyLbClans() {
  const log = new Logger()
  try {
    const client = await clientPromise
    const db = client.db("General")
    const CWStatsPlus = db.collection("CWStats+")

    const trackedLocationIDs = locations.filter((l) => l.isAdded || l.name === "Global").map((l) => l.id)

    const lbPromises = trackedLocationIDs.map((id) => getWarLeaderboard(id, false, 110))
    const allLbs = await Promise.all(lbPromises)

    if (allLbs.some((lb) => lb.error)) {
      return []
    }

    const allLbClans = allLbs
      .map((lb) => lb.data)
      .flat()
      .map((c) => ({
        badgeId: c.badgeId,
        clanScore: c.clanScore,
        location: c.location,
        name: c.name,
        tag: c.tag,
      }))
      .filter((c) => c.clanScore >= 4000)

    const cwstatsPlusTags = await getAllPlusClans(true)
    const chunkedPlusTags = chunk(cwstatsPlusTags, 3)

    for (const trio of chunkedPlusTags) {
      const clanPromises = trio.map((tag) => getClan(tag))
      const clans = await Promise.all(clanPromises)

      for (const { data: clan, error } of clans) {
        if (error || !clan) continue

        const { badgeId, clanWarTrophies, description, location, members, name, tag } = clan

        // remove clan from plus
        if (members === 0 || !description.toLowerCase().includes("cwstats") || clanWarTrophies < 2800) {
          CWStatsPlus.deleteOne({ tag })
          sendPlusWebhookEmbed("REMOVE_PLUS", {
            name,
            tag,
          })
          continue
        }

        // add plus to lb clans that are plus clans
        const clanFound = allLbClans.find((c) => c.tag === tag)

        if (clanFound) {
          clanFound.plus = true
          continue
        }

        // add new entry for plus clans that are not on war lbs
        allLbClans.push({
          badgeId,
          clanScore: clanWarTrophies,
          location,
          name,
          plus: true,
          tag,
        })
      }
    }

    return allLbClans
  } catch (e) {
    log.error("getAllDailyLbClans error", e)
    return []
  }
}

export async function getCurrentSeason(globalLb, sectionIndex) {
  if (!globalLb?.length) return

  for (const c of globalLb) {
    const resp = await getRaceLog(c.tag)

    if (!resp.data || !resp.data.length) continue

    const { data: log } = resp

    const { createdDate, seasonId, sectionIndex: lastLogSectionIndex } = log[0]

    const logDate = parseDate(createdDate)
    const daysDiff = getDaysDiff(logDate, new Date())

    // last log was created within the last 8 days
    if (daysDiff < 8) {
      if (sectionIndex > lastLogSectionIndex) return seasonId
      return seasonId + 1
    }
  }
}
