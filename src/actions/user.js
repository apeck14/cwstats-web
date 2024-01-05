"use server"

import clientPromise from "../lib/mongodb"

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
