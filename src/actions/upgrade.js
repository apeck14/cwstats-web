"use server"

/* eslint-disable perfectionist/sort-objects */

import { Logger } from "next-axiom"

import { formatDiscordStr, formatTag } from "@/lib/functions/utils"
import client from "@/lib/mongodb"
import { embedColors } from "@/static/colors"

import { getClan } from "./supercell"
import { getDiscordId } from "./user"

export const sendLogWebhook = async (data = {}, attachUser = false) => {
  try {
    const embed = {
      title: `__${data.title}__`,
      description: "",
      color: data.color || embedColors.green,
    }

    const orderedProps = ["clan", "tag", "guild"]

    for (const prop of orderedProps) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        // if prop exists in data
        const val = formatDiscordStr(data[prop])
        const displayedVal = prop === "clan" ? `[${val}](https://cwstats.com/clan/${data.tag.substring(1)})` : val
        embed.description += `**${prop.charAt(0).toUpperCase() + prop.slice(1)}**: ${displayedVal}\n`
      }
    }

    if (attachUser) {
      const { discordId } = await getDiscordId()
      embed.description += `**User**: ${discordId}`
    }

    if (data.details) {
      // add details to bottom of description
      embed.description += `\n\n${data.details}`
    }

    await fetch(process.env.WEBHOOK_URL, {
      body: JSON.stringify({ embeds: [embed] }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
  } catch (e) {
    const log = new Logger()
    log.error("sendLogWebhook error", e)
  }
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

    sendLogWebhook({
      clan: clan.name,
      tag: clan.tag,
      title: "New Plus Clan",
    })

    return { name: clan.name, tag: clan.tag }
  } catch (e) {
    const log = new Logger()
    log.error("addPlus error", e)
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
    const log = new Logger()
    log.error("isPlusClan error", e)
    return false
  }
}

export async function getClanTiers(tag) {
  try {
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const plusClan = await plus.findOne({ tag: formatTag(tag, true) })

    return {
      isPlus: !!plusClan,
      isPro: !!plusClan?.isPro,
    }
  } catch (e) {
    const log = new Logger()
    log.error("getClanTiers error", e)
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
  } catch (e) {
    const log = new Logger()
    log.error("getAllPlusClans error", e)
    return []
  }
}

export async function getAllClanTiers() {
  try {
    const db = client.db("General")
    const CWStatsPlus = db.collection("CWStats+")
    const plusClans = await CWStatsPlus.find({}).toArray()

    return plusClans.map((c) => ({
      tag: c.tag,
      isPlus: true,
      isPro: !!c?.isPro,
    }))
  } catch (e) {
    const log = new Logger()
    log.error("getAllClanTiers error", e)
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
    const log = new Logger()
    log.error("getPlusClanData error", e)
    return null
  }
}
