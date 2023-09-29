import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"

import clientPromise from "../../../lib/mongodb"
import { authOptions } from "../auth/[...nextauth]"

export default async function SavedClan(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).send({
        message: "No active session.",
      })
    }

    const { body, method } = req
    const { badge, name, tag } = body

    if (method !== "PUT" && method !== "POST") {
      return res.status(405).send({
        message: "Wrong method. PUT & POST only accepted.",
      })
    }

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const linkedAccounts = db.collection("Linked Accounts")

    const user = await accounts.findOne({
      userId: new ObjectId(session?.user?.id),
    })

    if (!user) {
      return res.status(404).json({
        message: "Account Not Found",
      })
    }

    if (method === "PUT") {
      const account = await linkedAccounts.findOne({
        discordID: user.providerAccountId,
      })

      if (account.savedClans.length >= 100) {
        return res.status(400).send({
          message: "Maximum saved clans reached.",
        })
      }

      if (account.savedClans.find((c) => c.tag === tag)) {
        return res.status(409).send({
          message: "Clan is already saved.",
        })
      }

      linkedAccounts.updateOne(
        {
          discordID: user.providerAccountId,
        },
        {
          $push: {
            savedClans: {
              badge,
              name,
              tag,
            },
          },
        }
      )

      return res.status(200).send({})
    }
    if (method === "POST") {
      linkedAccounts.updateOne(
        {
          discordID: user.providerAccountId,
        },
        {
          $pull: {
            savedClans: {
              tag,
            },
          },
        }
      )

      return res.status(200).send({})
    }

    throw new Error("Unknown Error")
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
