/* eslint-disable import/prefer-default-export */

"use server"

import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Logger } from "next-axiom"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import client from "@/lib/mongodb"

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

  try {
    const session = await getServerSession(authOptions)

    log.info("getGuilds user:", session?.user)

    if (!session || session.error === "RefreshAccessTokenError") {
      if (redirectOnError) sessionError = true
      else return { message: "Not logged in.", status: 403 }
    }

    const db = client.db("General")
    const accounts = db.collection("accounts")
    const guilds = db.collection("Guilds")

    const userId = new ObjectId(session.user.id)

    const user = await accounts.findOne({
      userId,
    })

    const data = await fetch("https://discordapp.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
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
    if (redirectOnError && sessionError) redirect("/login?callback=/me/servers")
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
