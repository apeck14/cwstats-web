"use server"

import { getServerSession } from "next-auth"
import { Logger } from "next-axiom"

import { authOptions, SessionErrors } from "@/app/api/auth/[...nextauth]/route"
import client from "@/lib/mongodb"

export async function getAccessToken() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.error === SessionErrors.REFRESH_TOKEN_ERROR) {
      return { error: SessionErrors.REFRESH_TOKEN_ERROR, logout: true }
    }

    return { token: session.user.access_token }
  } catch (err) {
    const log = new Logger()
    log.error("getAccessToken Error", err)

    return { error: err.message, logout: true, status: 500 }
  }
}

export async function getDiscordId() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "Not logged in.", logout: false }
    }

    if (!session?.user?.discord_id) {
      return { error: "No discord ID.", logout: true }
    }

    return { discordId: session.user.discord_id }
  } catch (err) {
    const log = new Logger()
    log.error("getDiscordId Error", err)

    return { error: err.message, status: 500 }
  }
}

export async function followClan({ badge, discordID, name, tag }) {
  try {
    const db = client.db("General")
    const linkedAccounts = db.collection("Linked Accounts")

    const linkedAccount = await linkedAccounts.findOne({ discordID })

    if (linkedAccount?.savedClans?.find((c) => c.tag === tag)) return { error: "Clan already saved." }

    await linkedAccounts.updateOne(
      {
        discordID,
      },
      {
        $push: {
          savedClans: {
            badge,
            name,
            tag,
          },
        },
      },
    )

    return { status: 200 }
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function unfollowClan({ discordID, tag }) {
  try {
    const db = client.db("General")
    const linkedAccounts = db.collection("Linked Accounts")

    await linkedAccounts.updateOne(
      {
        discordID,
      },
      {
        $pull: {
          savedClans: {
            tag,
          },
        },
      },
    )

    return { status: 200 }
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function followPlayer({ discordID, name, tag }) {
  try {
    const db = client.db("General")
    const linkedAccounts = db.collection("Linked Accounts")

    const linkedAccount = await linkedAccounts.findOne({ discordID })

    if (linkedAccount?.savedPlayers?.find((p) => p.tag === tag)) return { error: "Player already saved." }

    await linkedAccounts.updateOne(
      {
        discordID,
      },
      {
        $push: {
          savedPlayers: {
            name,
            tag,
          },
        },
      },
    )

    return { status: 200 }
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function unfollowPlayer({ discordID, tag }) {
  try {
    const db = client.db("General")
    const linkedAccounts = db.collection("Linked Accounts")

    await linkedAccounts.updateOne(
      {
        discordID,
      },
      {
        $pull: {
          savedPlayers: {
            tag,
          },
        },
      },
    )

    return { status: 200 }
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}
