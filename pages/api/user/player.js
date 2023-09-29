import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"

import clientPromise from "../../../lib/mongodb"
import { authOptions } from "../auth/[...nextauth]"

export default async function SavedPlayer(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).send({
        message: "You must be logged in.",
      })
    }

    const { body, method } = req
    const { name, tag } = body

    if (method !== "PUT" && method !== "DELETE") {
      return res.status(405).send({
        message: "Wrong method. PUT & DELETE only accepted.",
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

      if (account.savedPlayers.length >= 100) {
        return res.status(400).send({
          message: "Maximum saved players reached.",
        })
      }

      if (account.savedPlayers.find((p) => p.tag === tag)) {
        return res.status(409).send({
          message: "Player is already saved.",
        })
      }

      linkedAccounts.updateOne(
        {
          discordID: user.providerAccountId,
        },
        {
          $push: {
            savedPlayers: {
              name,
              tag,
            },
          },
        }
      )

      return res.status(200).send({})
    }
    if (method === "DELETE") {
      linkedAccounts.updateOne(
        {
          discordID: user.providerAccountId,
        },
        {
          $pull: {
            savedPlayers: {
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
