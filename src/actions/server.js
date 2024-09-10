/* eslint-disable import/prefer-default-export */

"use server"

import { redirect } from "next/navigation"
import { Logger } from "next-axiom"

import { formatTag, mongoSanitize } from "@/lib/functions/utils"
import client from "@/lib/mongodb"

import { getGuilds } from "./discord"
import { getClan, getPlayer } from "./supercell"

export async function getServerSettings(id, redirectOnError = false, authenticate = false) {
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

    if (abbreviations.length >= 15) {
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
      if (scheduled.length >= 5) {
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

export async function addLinkedAccount(id, tag, discordID) {
  try {
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: id,
    })

    if (!guildExists) return { message: "Server not found.", status: 404 }

    const { nudges } = guildExists
    const { links } = nudges || {}

    const formattedTag = formatTag(tag, true)

    if (links) {
      if (links.length >= 300) {
        return { message: "Max number of linked accounts reached.", status: 400 }
      }

      const tagAlreadyLinked = guildExists.nudges.links.some((l) => l.tag === formattedTag)

      if (tagAlreadyLinked) {
        return {
          message: "This tag is already linked to a Discord user.",
          status: 400,
        }
      }
    }

    const { data: player, error, status } = await getPlayer(tag)

    if (status === 404) return { message: "Player does not exist.", status: 404 }
    if (error) return { message: "Unexpected Supercell error.", status }

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
export async function setChannels(id, channels) {
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

    const channelQuery = { ...channels }

    // remove empty values from query
    for (const prop of Object.keys(channelQuery)) {
      const val = channelQuery[prop]

      if (!val.length) delete channelQuery[prop]
    }

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          channels: channelQuery,
        },
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
