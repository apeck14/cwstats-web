"use server"

/* eslint-disable perfectionist/sort-objects */

import { formatTag } from "@/lib/functions/utils"
import clientPromise from "@/lib/mongodb"

import { getClan } from "./supercell"

export const sendPlusWebhookEmbed = (type, clan = {}) => {
  const embed = {}

  if (type === "ADD_PLUS") {
    embed.color = 0xffa500
    embed.title = "__New Plus Clan!__"
  } else if (type === "REMOVE_PLUS") {
    embed.color = 0xff0f0f
    embed.title = "__Plus Clan Removed!__"
  }

  embed.description = `**Clan**: [${clan.name}](https:cwstats.com/clan/${clan.tag.substring(1)})\n**Tag**: ${clan.tag}`

  return fetch(process.env.WEBHOOK_URL, {
    body: JSON.stringify({ embeds: [embed] }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
}

export async function addPlus(tag) {
  const { data: clan, error } = await getClan(tag)

  if (error) return { error }
  if (clan.members === 0) return { error: "Clan no longer exists." }
  if (clan.clanWarTrophies < 3000) return { error: "Clan must have at least 3000 war trophies." }

  // check description for "cwstats" (FF clans can't use .com)
  const hasUrlInDescription = clan.description.toLowerCase().includes("cwstats")
  if (!hasUrlInDescription) return { error: 'Clan description must contain "CWStats.com".' }

  try {
    const client = await clientPromise
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const clanAlreadyPlus = await plus.findOne({ tag: clan.tag })

    if (clanAlreadyPlus) return { error: "Clan is already activated. 🎉" }

    await plus.insertOne({ tag: clan.tag, hourlyAverages: [] })

    sendPlusWebhookEmbed("ADD_PLUS", {
      name: clan.name,
      tag: clan.tag,
    })

    return { name: clan.name, tag: clan.tag }
  } catch {
    return { error: "Unexpected error. Please try again." }
  }
}

export async function isPlusClan(tag) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const plusClan = await plus.findOne({ tag: formatTag(tag, true) })

    return !!plusClan
  } catch (e) {
    return false
  }
}

export async function getAllPlusClans(tagsOnly = false) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const CWStatsPlus = db.collection("CWStats+")
    let data

    if (tagsOnly) {
      data = await CWStatsPlus.distinct("tag")
    } else {
      data = await CWStatsPlus.find({}).toArray()
    }

    return data
  } catch {
    return []
  }
}

export async function getPlusClanData(tag, formatHourlyAverages = false) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const plusClan = await plus.findOne({ tag: formatTag(tag, true) })

    if (!plusClan) return null

    if (formatHourlyAverages) {
      const hourlyAverages = {}

      for (const entry of plusClan.hourlyAverages) {
        const { season, week, day, avg, timestamp, lastHourAvg } = entry

        if (!hourlyAverages[season]) hourlyAverages[season] = {}
        if (!hourlyAverages[season][week]) hourlyAverages[season][week] = {}
        if (!hourlyAverages[season][week][day]) hourlyAverages[season][week][day] = []

        hourlyAverages[season][week][day].push({ avg, timestamp, lastHourAvg })
      }

      return { ...plusClan, hourlyAverages }
    }

    return plusClan
  } catch (e) {
    return null
  }
}
