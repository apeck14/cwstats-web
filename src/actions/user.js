"use server"

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { Logger } from "next-axiom"

import { authOptions } from "../app/api/auth/[...nextauth]/route"
import clientPromise from "../lib/mongodb"

export async function getLinkedAccount() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) return JSON.parse(JSON.stringify({ message: "Not logged in.", status: 403 }))

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const linkedAccounts = db.collection("Linked Accounts")

    const userId = new ObjectId(session?.user?.id)

    const user = await accounts.findOne({
      userId,
    })

    if (!user) return JSON.parse(JSON.stringify({ status: 404 }))

    const linkedAccount = await linkedAccounts.findOne({
      discordID: user.providerAccountId,
    })

    if (!linkedAccount) return JSON.parse(JSON.stringify({ status: 404 }))

    return JSON.parse(JSON.stringify({ success: true, ...linkedAccount, status: 200 }))
  } catch (err) {
    const log = new Logger()
    log.error("getLinkedAccount Error", err)

    return { message: err.message, status: 500 }
  }
}

export async function followClan({ badge, discordID, name, tag }) {
  try {
    const client = await clientPromise
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
    const client = await clientPromise
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
    const client = await clientPromise
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
    const client = await clientPromise
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
