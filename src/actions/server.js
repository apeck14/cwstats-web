/* eslint-disable import/prefer-default-export */

"use server"

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Logger } from "next-axiom"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { formatTag, mongoSanitize } from "@/lib/functions/utils"
import clientPromise from "@/lib/mongodb"

import { getClan } from "./supercell"

export async function getServerSettings(id, redirectOnError = false, authenticate = false) {
  const logger = new Logger()
  logger.info("Server ID", id)

  if (authenticate) {
    const session = await getServerSession(authOptions)

    logger.info("Session", session)

    if (!session) {
      redirect("/login?callback=/me/servers")
    }
  }

  const client = await clientPromise
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
    const client = await clientPromise
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
    const client = await clientPromise
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

export async function setWarReport(id, tag, timeStr, channelId) {
  try {
    const formattedTag = formatTag(tag)
    const { data: clan, error, status } = await getClan(formattedTag)

    if (status === 404) return { message: "Clan does not exist.", status: 404 }
    if (error) return { message: "Unexpected Supercell error.", status }
    if (clan.members === 0) return { message: "Clan has been deleted.", status: 404 }

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const warReport = {
      clanTag: clan.tag,
      name: clan.name,
      scheduledReportTimeHHMM: timeStr,
    }

    // set report channel and war report
    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          "channels.reportChannelID": channelId,
          warReport,
        },
      },
    )

    return { name: clan.name, status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("setWarReport error", err)

    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function deleteWarReport(id) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $unset: {
          "channels.reportChannelID": "",
          warReport: "",
        },
      },
    )

    return { status: 200, success: true }
  } catch (err) {
    const logger = new Logger()
    logger.error("deleteWarReport error", err)

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

    const client = await clientPromise
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
    const client = await clientPromise
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

export async function updateNudgeSettings(id, settings = { ignoreLeaders: false, message: "" }) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: id,
      },
      {
        $set: {
          "nudges.ignoreLeaders": settings.ignoreLeaders,
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
