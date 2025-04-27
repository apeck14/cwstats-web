"use server"

import fs from "fs"
import { redirect } from "next/navigation"
import { Logger } from "next-axiom"

import client from "@/lib/mongodb"

import { getAccessToken } from "./user"

const hasAdminPermissions = (permissions) => {
  const ADMIN = 0x8
  const MANAGE = 0x20 // MANAGE_GUILD

  return (permissions & MANAGE) === MANAGE || (permissions & ADMIN) === ADMIN
}

// return all guilds that user shares with the bot, and has Manage Server+ in
export async function getGuilds(redirectOnError = false) {
  const log = new Logger()
  let error = false
  let sessionError = false
  let signUserOut = false

  try {
    const { error, logout, token } = await getAccessToken()

    if (logout) {
      signUserOut = true
      throw error
    }

    if (error) {
      if (redirectOnError) {
        sessionError = true
        throw error
      }

      return { error }
    }

    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const data = await fetch("https://discordapp.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const [allGuilds, botGuildIds] = await Promise.all([data.json(), guilds.distinct("guildID")])

    if (Array.isArray(allGuilds)) {
      const filteredGuildsByPermissions = allGuilds
        .filter((g) => (g.owner || hasAdminPermissions(g.permissions)) && botGuildIds.includes(g.id))
        .sort((a, b) => {
          if (!a.icon && !b.icon) return a.name.localeCompare(b.name)
          return !!b.icon - !!a.icon
        })

      return { data: filteredGuildsByPermissions, status: 200, success: true }
    }

    throw allGuilds
  } catch (err) {
    log.warn(`getGuilds Error`, err)

    if (!redirectOnError) return { message: err?.message || err, status: 500 }
    error = true
  } finally {
    if (signUserOut || (redirectOnError && sessionError)) redirect("/login?callback=/me/servers")
    else if (redirectOnError && error) redirect("/500_")
  }
}

export async function getGuild(id, redirectOnError = false) {
  let error = false

  try {
    const res = await fetch(`https://discordapp.com/api/guilds/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    })
    const data = await res.json()

    if (!data?.name) throw new Error(data)

    return { data, status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("getGuild Error", err)

    if (!redirectOnError) return { message: err?.message || err, status: 500 }
    error = true
  } finally {
    if (redirectOnError && error) redirect("/500_")
  }
}

export async function getGuildChannels(id, redirectOnError = false) {
  let error = false
  try {
    const res = await fetch(`https://discordapp.com/api/guilds/${id}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    })
    const data = await res.json()

    if (!Array.isArray(data)) throw new Error(data)

    return { data, status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("getGuildChannels Error", err)

    if (!redirectOnError) return { message: err?.message || err, status: 500 }
    error = true
  } finally {
    if (redirectOnError && error) redirect("/500_")
  }
}

export async function searchGuildUsers(id, query) {
  try {
    const res = await fetch(`https://discordapp.com/api/guilds/${id}/members/search?query=${query}&&limit=5`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    })
    const data = await res.json()

    if (!Array.isArray(data)) throw new Error(data)

    return { data, status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("searchGuildUsers Error", err)

    return { message: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function isValidInviteCode(id, code) {
  try {
    const res = await fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`)
    const data = await res.json()

    if (!data || !data?.guild_id) return { error: "Invalid invite.", status: 404 }
    if (data.expires_at) return { error: "Please create a new invite without an expiration.", status: 400 }
    if (data.guild.id !== id) return { error: "Invite does not belong to this server.", status: 400 }

    return { status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("isValidInviteCode Error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function createWebhook(channelId, title, tag, isPlus) {
  try {
    if (!isPlus) return { error: "Activate CWStats+ to use this feature." }

    const base64Image = fs.readFileSync("public/assets/icons/bot-logo.png", { encoding: "base64" })

    const webhook = {
      avatar: `data:image/png;base64,${base64Image}`,
      name: title,
    }

    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/webhooks`, {
      body: JSON.stringify(webhook),
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    })

    const data = await res.json()

    if (data.message === "Missing Permissions") return { error: "Missing Permission: Manage Webhooks" }
    if (!res.ok) return { error: "Unexpected error. Try again." }

    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    linkedClans.updateOne({ tag }, { $set: { webhookUrl: data.url } })

    return { status: 200, success: true, url: data.url }
  } catch (err) {
    const log = new Logger()
    log.warn("createWebhook Error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function getAllGuildUsers(id, mapResponse = false) {
  try {
    let members = []
    let lastMemberId = null
    let hasMore = true

    while (hasMore) {
      const url = new URL(`https://discord.com/api/v10/guilds/${id}/members`)
      url.searchParams.append("limit", "1000")

      if (lastMemberId) {
        url.searchParams.append("after", lastMemberId)
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      })

      const data = await res.json()

      if (data.length > 0) {
        members = members.concat(
          mapResponse ? data.map((m) => ({ id: m.user.id, username: m.user.username.toLowerCase() })) : data,
        )

        lastMemberId = data[data.length - 1].user.id // Set the last member ID for pagination

        if (data.length < 1000) hasMore = false
      } else {
        hasMore = false
      }
    }

    return { members, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("getAllGuildUsers Error", err)

    return { error: "Unexpected error. Please try again." }
  }
}

export async function setDailyWarReport(tag, enabled = true) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    linkedClans.updateOne({ tag }, { $set: { warReportEnabled: enabled } })

    return { status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("setDailyWarReport Error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function setSeasonalReport(tag, enabled = true) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    linkedClans.updateOne({ tag }, { $set: { seasonalReportEnabled: enabled } })

    return { status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("setSeasonalReport Error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function updateDiscordNickname({ guildId, nickname, userId }) {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
      body: JSON.stringify({ nick: nickname }),
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data?.message)

    return { status: 200, success: true }
  } catch (err) {
    const log = new Logger()
    log.warn("updateDiscordNickname Error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}
