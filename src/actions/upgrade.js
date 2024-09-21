"use server"

/* eslint-disable perfectionist/sort-objects */

import { formatTag } from "@/lib/functions/utils"
import client from "@/lib/mongodb"

import { getClan } from "./supercell"

export const sendWebhookEmbed = (type, data = {}) => {
  const embed = {}

  if (type === "ADD_PLUS") {
    embed.color = 0xffa500
    embed.title = "__New Plus Clan!__"
    embed.description = `**Clan**: [${data.name}](https:cwstats.com/clan/${data.tag.substring(1)})\n**Tag**: ${data.tag}`
  } else if (type === "REMOVE_PLUS") {
    embed.color = 0xff0f0f
    embed.title = "__Plus Clan Removed!__"
    embed.description = `**Clan**: [${data.name}](https:cwstats.com/clan/${data.tag.substring(1)})\n**Tag**: ${data.tag}`
  } else if (type === "CLAN_LINKED") {
    embed.color = 0x00ff00
    embed.title = "__Clan Linked!__"
    embed.description = `**Clan**: [${data.name}](https:cwstats.com/clan/${data.tag.substring(1)})\n**Tag**: ${data.tag}\n**Guild**: ${data.id}`
  }

  return fetch(process.env.WEBHOOK_URL, {
    body: JSON.stringify({ embeds: [embed] }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then(() => {})
    .catch(() => {})
}

export async function addPlus(tag) {
  const { data: clan, error } = await getClan(tag)

  if (error) return { error }
  if (clan.members === 0) return { error: "Clan no longer exists." }
  if (clan.clanWarTrophies < 2500) return { error: "Clan must have at least 2500 war trophies." }

  // check description for "cwstats" (FF clans can't use .com)
  const lowercaseDesc = clan.description.toLowerCase()
  const hasUrlInDescription = lowercaseDesc.includes("cwstats") || lowercaseDesc.includes("cw-stats")
  if (!hasUrlInDescription) return { error: 'Clan description must contain "CWStats.com".' }

  try {
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const clanAlreadyPlus = await plus.findOne({ tag: clan.tag })

    if (clanAlreadyPlus) return { error: "Clan is already activated. 🎉" }

    await plus.insertOne({ tag: clan.tag, hourlyAverages: [] })

    sendWebhookEmbed("ADD_PLUS", {
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
