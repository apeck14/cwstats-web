/* eslint-disable import/prefer-default-export */

"use server"

import { redirect } from "next/navigation"
import { Logger } from "next-axiom"

import {
  calcLinkedPlayerLimit,
  calcNudgeLimit,
  formatTag,
  generateDiscordNickname,
  getClanBadgeFileName,
  mongoSanitize,
} from "@/lib/functions/utils"
import client from "@/lib/mongodb"

import { API_BASE_URL } from "../../public/static/constants"
import { getAllGuildUsers, getGuilds, isValidInviteCode, updateDiscordNickname } from "./discord"
import { getClan, getClanMembers, getPlayer } from "./supercell"
import { getAllPlusClans } from "./upgrade"

const isDev = process.env.NODE_ENV === "development"
const { INTERNAL_API_KEY } = process.env

export const handleAPISuccess = async (res) => {
  const contentType = res.headers.get("content-type") || ""

  const isJson = contentType.includes("application/json")
  const body = isJson ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    throw {
      error: isJson ? body?.error : `Unexpected error: ${body.slice(0, 100)}...`,
      status: res.status,
    }
  }

  return isJson ? body : {}
}

// Format error messages to make them more user friendly
export const handleAPIFailure = (e, notFoundMessage = `Not found.`) => {
  const status = e?.status
  const errorText = e?.error

  let error = `Unexpected error. Please try again.`

  if (status === 404) error = notFoundMessage
  else if (status === 429) error = `Rate limit exceeded. Please try again later.`
  else if (status === 503) error = `Maintenance break.`
  else if (status !== 500 && errorText) error = errorText

  return { error, status }
}

export async function getServerSettings(id, redirectOnError = false, authenticate = !isDev) {
  if (authenticate) {
    const { data: guilds } = await getGuilds(true)

    const guild = guilds.find((g) => g.id === id)

    if (!guild) {
      redirect("/404_")
    }
  }

  const db = client.db("General")
  const guilds = db.collection("Guilds")

  const guild = await guilds.findOne({ guildID: id })

  if (!guild) {
    if (redirectOnError) redirect("/404_")
    return { message: "Guild not found in DB.", status: 404 }
  }

  delete guild._id

  return { guild, status: 200 }
}

export async function addAbbreviation(id, abbr, tag) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { message: "Server not found.", status: 404, type: "abbr" }

    const { abbreviations } = guildExists

    if (abbreviations.length >= 20) {
      return { message: "Max number of abbreviations reached.", status: 400, type: "abbr" }
    }

    if (abbr.length > 4) {
      return {
        message: "Abbreviation cannot be larger than 4 characters.",
        status: 400,
        type: "abbr",
      }
    }

    if (!abbr.match(/^[0-9a-zA-Z]+$/)) {
      return { message: "Abbreviation must be alphanumeric.", status: 400, type: "abbr" }
    }

    const uppercaseAbbr = abbr.toUpperCase()

    if (abbreviations.find((a) => a.abbr.toUpperCase() === uppercaseAbbr)) {
      return {
        message: "This abbreviation is already in use.",
        status: 400,
        type: "abbr",
      }
    }

    const formattedTag = formatTag(tag, true)

    if (abbreviations.find((a) => a.tag === formattedTag))
      return {
        message: "This clan already has an abbreviation.",
        status: 500,
        type: "clan",
      }

    const { data: clan, error, status } = await getClan(tag)

    if (status === 404) return { message: "Clan does not exist.", status: 404, type: "clan" }
    if (error) return { message: "Unexpected Supercell error.", status, type: "abbr" }
    if (clan.members === 0) return { message: "Clan has been deleted.", status: 404, type: "clan" }

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $push: {
          abbreviations: {
            abbr,
            name: clan.name,
            tag: clan.tag,
          },
        },
      },
    )

    return { name: clan.name, status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("addAbbreviation error", err)

    return { error: "Unexpected error. Please try again.", status: 500, type: "abbr" }
  }
}

export async function deleteAbbreviation(id, abbr) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $pull: {
          abbreviations: {
            abbr,
          },
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteAbbreviation error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function setDefaultClan(id, tag) {
  try {
    const formattedTag = formatTag(tag)
    const { data: clan, error, status } = await getClan(formattedTag)

    if (status === 404) return { message: "Clan does not exist.", status: 404 }
    if (error) return { message: "Unexpected Supercell error.", status }
    if (clan.members === 0) return { message: "Clan has been deleted.", status: 404 }

    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          defaultClan: {
            name: clan.name,
            tag: clan.tag,
          },
        },
      },
    )

    return { name: clan.name, status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("setDefaultClan error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function deleteDefaultClan(id) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $unset: {
          defaultClan: "",
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteDefaultClan error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function updateNudgeSettings(
  id,
  settings = { ignoreLeaders: false, ignoreWhenCrossedFinishLine: false, message: "" },
) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          "nudges.ignoreLeaders": settings.ignoreLeaders,
          "nudges.ignoreWhenCrossedFinishLine": settings.ignoreWhenCrossedFinishLine,
          "nudges.message": mongoSanitize(settings.message),
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("updateNudgeSettings error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function deleteScheduledNudge(id, tag, hourUTC) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $pull: {
          "nudges.scheduled": {
            clanTag: formatTag(tag, true),
            scheduledHourUTC: parseInt(hourUTC),
          },
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteScheduledNudge error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function deleteLinkedAccount(id, tag, discordID) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $pull: {
          "nudges.links": {
            discordID,
            tag,
          },
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteLinkedAccount error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

// value: channel ID, keyword, or array of channel IDs (command)
export async function setGuildChannelData(id, channels) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    if (channels.commandChannelKeyword) {
      if (channels.commandChannelKeyword.length < 2) {
        return { error: "Keyword must be at least 2 characters." }
      }

      if (channels.commandChannelKeyword.length > 10) {
        return { error: "Keyword cannot be larger than 10 characters." }
      }
    }

    const query = {}

    for (const prop of Object.keys(channels)) {
      query[`channels.${prop}`] = channels[prop]
    }

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: query,
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("setChannel error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function setAdminRole(id, roleId) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          adminRoleID: roleId,
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("setAdminRole error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function generateLinkCode(id, tag) {
  try {
    if (!id || !tag) return { error: "Missing ID or TAG.", status: 400 }

    const { data: clan, error, status } = await getClan(tag)

    if (status === 404) return { error: "Clan does not exist.", status: 404 }
    if (error) return { error: "Unexpected Supercell error.", status }
    if (clan?.members === 0) return { error: "Clan has been deleted.", status: 404 }

    const db = client.db("General")
    const clanLinkCodes = db.collection("Clan Link Codes")
    const linkedClans = db.collection("Linked Clans")

    const clanAlreadyLinked = await linkedClans.findOne({ tag: clan.tag })
    if (clanAlreadyLinked) return { error: "Clan is already linked to a server.", status: 400 }

    const clansLinkedToServer = await linkedClans.find({ guildID: id }).toArray()
    if (clansLinkedToServer.length >= 20) return { error: "Max clans linked to server reached.", status: 400 }

    const codeExists = await clanLinkCodes.findOne({ guildID: id, tag: clan.tag })
    if (codeExists) return { code: codeExists.code, status: 200 }

    const randomCode = String(Math.floor(Math.random() * 10000)).padStart(4, "0")

    await clanLinkCodes.insertOne({
      code: randomCode,
      createdAt: new Date(),
      guildID: id,
      tag: clan.tag,
    })

    return { code: randomCode, status: 200 }
  } catch (err) {
    const logger = new Logger()
    logger.error("generateLinkCode error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

export async function linkClanToServer(id, tag) {
  try {
    if (!id || !tag) return { error: "Missing ID or TAG or CODE.", status: 400 }

    const { data: clan, error, status } = await getClan(tag)

    if (status === 404) return { error: "Clan does not exist.", status: 404 }
    if (error) return { error: "Unexpected Supercell error.", status }
    if (clan?.members === 0) return { error: "Clan has been deleted.", status: 404 }

    const db = client.db("General")
    const clanLinkCodes = db.collection("Clan Link Codes")
    const linkedClans = db.collection("Linked Clans")
    const guilds = db.collection("Guilds")

    const { code } = (await clanLinkCodes.findOne({ guildID: id, tag: clan.tag })) || {}

    if (!code) return { error: "Code has expired. Please try again.", status: 404 }
    if (!clan.description.includes(code)) return { error: "Code not found in clan description.", status: 400 }

    const clansLinkedToServer = await linkedClans.find({ guildID: id }).toArray()
    if (clansLinkedToServer.length >= 20) return { error: "Max linked clans reached.", status: 400 }

    const clanAlreadyLinked = await linkedClans.findOne({ tag: clan.tag })
    if (clanAlreadyLinked) return { error: "Clan is already linked to a server.", status: 400 }

    const guild = await guilds.findOne({ guildID: id })

    const linkedClan = {
      clanBadge: getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies),
      clanName: clan.name,
      guildID: id,
      tag: clan.tag,
    }

    // add invite code if already set on guild
    if (guild.discordInviteCode) linkedClan.discordInviteCode = guild.discordInviteCode

    await Promise.all([
      linkedClans.insertOne(linkedClan),
      clanLinkCodes.deleteMany({
        tag: clan.tag,
      }),
    ])

    return { clan: linkedClan, status: 200 }
  } catch (err) {
    const logger = new Logger()
    logger.error("linkClanToServer error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

export async function getLinkedClans(id, plusOnly = false) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    let serverLinkedClans = await linkedClans.find({ guildID: id }).toArray()

    if (plusOnly) {
      const allPlusClans = await getAllPlusClans(true)
      serverLinkedClans = serverLinkedClans.filter((c) => allPlusClans.includes(c.tag))
    }

    for (const c of serverLinkedClans) {
      delete c._id
    }

    return { clans: serverLinkedClans || [] }
  } catch (err) {
    const logger = new Logger()
    logger.error("getLinkedClans error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

export async function getLinkedClanByTag(tag) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    const clan = await linkedClans.findOne({ tag })

    if (!clan) return { error: "Clan not found.", status: 404 }

    delete clan._id

    return { clan, status: 200 }
  } catch (err) {
    const logger = new Logger()
    logger.error("getLinkedClanByTag error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

export async function setDiscordInvite(id, invCode) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")
    const guilds = db.collection("Guilds")

    const discordInviteCode = invCode?.replace(/[^a-zA-Z0-9]/g, "")

    if (invCode) {
      // make HTTP req to see if inv is valid
      const { error } = await isValidInviteCode(id, discordInviteCode)
      if (error) return { error }
    }

    await Promise.all([
      linkedClans.updateMany({ guildID: id }, { $set: { discordInviteCode } }),
      guilds.updateOne({ guildID: id }, { $set: { discordInviteCode } }),
    ])

    return { status: 200 }
  } catch (err) {
    const logger = new Logger()
    logger.error("setDiscordInvite error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

// called on plus clan deletion or plus link unlinking from server
// check if any plus features are over new limit
async function deleteOverLimitUsage(id) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { error: "Server not found." }

    const { clans: plusClans, error } = await getLinkedClans(id, true)

    if (error) throw error

    const linkedPlayerLimit = calcLinkedPlayerLimit(plusClans.length)
    const scheduledNudgeLimit = calcNudgeLimit(plusClans.length)

    // slice extra limits
    if (guildExists.nudges) {
      await guilds.updateOne(
        { guildID: id },
        {
          $push: {
            "nudges.links": {
              $each: [],
              $slice: linkedPlayerLimit,
            },
            "nudges.scheduled": {
              $each: [],
              $slice: scheduledNudgeLimit,
            },
          },
        },
      )
    }

    return { linkedPlayerLimit, scheduledNudgeLimit }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteOverLimitUsage error", err)

    return { error: "Unexpected error. Please try again." }
  }
}

export async function deleteLinkedClan(id, tag) {
  try {
    const db = client.db("General")
    const linkedClans = db.collection("Linked Clans")

    await Promise.all([linkedClans.deleteOne({ tag }), deleteOverLimitUsage(id)])

    return { status: 200 }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteLinkedClan error", err)

    return { error: "Unexpected error. Please try again.", status: 400 }
  }
}

export async function addScheduledNudge(id, tag, hourUTC, channelID) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { message: "Server not found.", status: 404 }

    const { nudges } = guildExists
    const { scheduled } = nudges || {}

    if (scheduled) {
      const { clans: linkedClans } = await getLinkedClans(id)

      if (scheduled.length >= calcNudgeLimit(linkedClans.length)) {
        return { message: "Max number of nudges reached.", status: 400 }
      }

      const duplicateExists = scheduled.find((sn) => sn.clanTag === tag && sn.scheduledHourUTC === hourUTC)

      if (duplicateExists) {
        return {
          message: "You cannot have duplicate nudges.",
          status: 400,
          type: "clan",
        }
      }
    }

    const { data: clan, error, status } = await getClan(tag)

    if (status === 404) return { message: "Clan does not exist.", status: 404, type: "clan" }
    if (error) return { message: "Unexpected Supercell error.", status, type: "clan" }
    if (clan.members === 0) return { message: "Clan has been deleted.", status: 404, type: "clan" }

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $push: {
          "nudges.scheduled": {
            channelID,
            clanName: clan.name,
            clanTag: clan.tag,
            scheduledHourUTC: parseInt(hourUTC),
          },
        },
      },
    )

    return { name: clan.name, status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("addScheduledNudge error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function editScheduledNudge(id, oldNudge, newNudge) {
  if (!id || !newNudge || !newNudge.clanTag || !newNudge.scheduledHourUTC || !newNudge.channelID) {
    return { error: "Missing required fields." }
  }

  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { error: "Server not found." }

    const { nudges } = guildExists
    const { scheduled } = nudges || {}

    if (scheduled) {
      const isSameNudge =
        oldNudge.clanTag === newNudge.clanTag && oldNudge.scheduledHourUTC === newNudge.scheduledHourUTC

      if (!isSameNudge) {
        const duplicateExists = scheduled.find(
          (sn) => sn.clanTag === newNudge.clanTag && sn.scheduledHourUTC === newNudge.scheduledHourUTC,
        )

        if (duplicateExists) return { error: "You cannot have duplicate nudges." }
      }
    }

    await guilds.updateOne(
      {
        guildID: id,
        "nudges.scheduled": {
          $elemMatch: {
            clanTag: oldNudge.clanTag,
            scheduledHourUTC: oldNudge.scheduledHourUTC,
          },
        },
      },
      {
        $set: {
          "nudges.scheduled.$": { ...newNudge },
        },
      },
    )

    return { success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("editScheduledNudge error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function addLinkedAccount(id, tag, discordID, updateNickname = false) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { error: "Server not found.", status: 404 }

    const { nudges } = guildExists
    const { links } = nudges || {}

    const formattedTag = formatTag(tag, true)

    if (links) {
      const { clans: linkedPLusClans } = await getLinkedClans(id, true)

      if (links.length >= calcLinkedPlayerLimit(linkedPLusClans.length)) {
        return { message: "Max number of linked accounts reached.", status: 400 }
      }

      const tagAlreadyLinked = links.some((l) => l.tag === formattedTag)

      if (tagAlreadyLinked) {
        return {
          message: "This tag is already linked to a Discord user.",
          status: 400,
        }
      }
    }

    const { data: player, error, status } = await getPlayer(tag)

    if (status === 404) return { error: "Player does not exist.", status: 404 }
    if (error) return { error: "Unexpected Supercell error.", status }

    if (updateNickname) {
      const existingLinks = links?.filter((l) => l.discordID === discordID)?.map((l) => l.name) || []
      const newNickname = generateDiscordNickname([...existingLinks, player.name])
      updateDiscordNickname({ guildId: id, nickname: newNickname, userId: discordID })
    }

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $push: {
          "nudges.links": {
            discordID,
            name: player.name,
            tag: player.tag,
          },
        },
      },
    )

    return { name: player.name, status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("addLinkedAccount error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

// playersToAdd: [{ username: "", tag: "", name: "" }]
export async function bulkLinkAccounts(id, playersToAdd, updateNickname = false) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const [guildExists, linkedClans] = await Promise.all([guilds.findOne({ guildID: id }), getAllPlusClans(true)])

    if (!guildExists) return { error: "Server not found." }

    const links = guildExists.nudges?.links || []
    const linksSet = new Set(links.map((l) => l.tag))

    const linkedPlayerLimit = calcLinkedPlayerLimit(linkedClans.length)
    let availableLinks = linkedPlayerLimit - linksSet.size

    if (availableLinks <= 0) return { error: "No player links remaining." }

    const { error, members } = await getAllGuildUsers(id, true)
    if (error) return { error }

    // Map usernames for faster lookup
    const memberMap = new Map(members.map((m) => [m.username.toLowerCase(), m]))

    for (const p of playersToAdd) {
      const formattedUsername = p.username.trim().toLowerCase()
      if (!formattedUsername) {
        p.error = "Invalid username."
        continue
      }

      const user = memberMap.get(formattedUsername)
      if (!user) {
        p.error = "User not found."
        continue
      }

      if (availableLinks <= 0) {
        p.error = "No player links remaining."
        continue
      }

      const formattedTag = formatTag(p.tag, true)
      if (linksSet.has(formattedTag)) {
        p.error = "Player already linked."
        continue
      }

      // All checks passed: add the player
      p.added = true
      p.discordID = user.id
      linksSet.add(formattedTag)

      // Update nickname if needed (non-blocking)
      if (updateNickname) {
        const existingLinks = links.filter((l) => l.discordID === user.id).map((l) => l.name)
        const newNickname = generateDiscordNickname([...existingLinks, p.name])
        updateDiscordNickname({ guildId: id, nickname: newNickname, userId: user.id })
      }

      // Update database
      await guilds.updateOne(
        { guildID: id },
        { $push: { "nudges.links": { discordID: user.id, name: p.name, tag: formattedTag } } },
      )

      // Update local links cache
      links.push({ discordID: user.id, name: p.name, tag: formattedTag })
      availableLinks--
    }

    return { players: playersToAdd }
  } catch (err) {
    const logger = new Logger()
    logger.error("bulkLinkAccounts error", err)
    return { error: "Unexpected error. Please try again." }
  }
}

export async function bulkUnlinkAccounts(id) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const [guildExists, { error, members }] = await Promise.all([
      guilds.findOne({
        guildID: id,
      }),
      getAllGuildUsers(id, true),
    ])

    if (!guildExists) return { error: "Server not found." }
    if (error) return { error }

    const { nudges } = guildExists
    const { links } = nudges || {}

    const playerLinks = links ?? []
    const userIdSet = new Set(members.map((m) => m.id))

    const linksRemoved = []
    const tagsRemoved = []

    for (const link of playerLinks) {
      if (!userIdSet.has(link.discordID)) {
        linksRemoved.push(link)
        tagsRemoved.push(link.tag)
      }
    }

    if (linksRemoved.length) {
      await guilds.updateOne(
        { guildID: id },
        {
          $pull: {
            "nudges.links": {
              tag: { $in: tagsRemoved },
            },
          },
        },
      )
    }

    return { linksRemoved }
  } catch (err) {
    const logger = new Logger()
    logger.error("bulkUnlinkAccounts error", err)

    return { error: "Unexpected error. Please try again." }
  }
}

export async function getUnlinkedPlayersByClan(id, tag) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const [guildExists, { data: memberList, error }] = await Promise.all([
      guilds.findOne({
        guildID: id,
      }),
      getClanMembers(tag),
    ])

    if (!guildExists) return { error: "Server not found." }
    if (error) return { error }

    const { nudges } = guildExists
    const { links } = nudges || {}

    const mappedPlayers = memberList
      .map((p) => ({ name: p.name, tag: p.tag }))
      .sort((a, b) => a.name.localeCompare(b.name))

    if (!links || !links.length) return { players: mappedPlayers }

    const linkedTagsSet = new Set(links.map((p) => p.tag))
    const unlinkedPlayers = []

    for (const p of mappedPlayers) {
      if (!linkedTagsSet.has(p.tag)) unlinkedPlayers.push(p)
    }

    return { players: unlinkedPlayers }
  } catch (err) {
    const logger = new Logger()
    logger.error("getUnlinkedPlayersByClan error", err)

    return { error: "Unexpected error. Please try again." }
  }
}

export async function setUpdateNicknameUponLinking(id, value) {
  try {
    if (typeof value !== "boolean") throw new Error("Value must be a boolean.")

    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          "nudges.updateNicknameUponLinking": value,
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("setUpdateNicknameUponLinking error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export const setWarLogClan = async ({ channelId, guildId, tag }) =>
  fetch(`${API_BASE_URL}/pro/war-logs`, {
    body: JSON.stringify({ channelId, guildId, tag: formatTag(tag, false) }),
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)

export const setWarLogClanActive = async (tag, active) =>
  fetch(`${API_BASE_URL}/war-logs/active`, {
    body: JSON.stringify({ active, tag: formatTag(tag, false) }),
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)

export const setClanLogClan = async ({ channelId, guildId, tag }) =>
  fetch(`${API_BASE_URL}/pro/clan-logs`, {
    body: JSON.stringify({ channelId, guildId, tag: formatTag(tag, false) }),
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)

export const setClanLogClanEnabled = async (tag, enabled) =>
  fetch(`${API_BASE_URL}/clan-logs/enabled`, {
    body: JSON.stringify({ enabled, tag: formatTag(tag, false) }),
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)

export const setGuildTimezone = async (id, timezone) =>
  fetch(`${API_BASE_URL}/guild/${id}/timezone`, {
    body: JSON.stringify({ timezone }),
    headers: {
      Authorization: `Bearer ${INTERNAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  })
    .then(handleAPISuccess)
    .catch(handleAPIFailure)
