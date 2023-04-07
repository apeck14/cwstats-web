import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import clientPromise from "../../../lib/mongodb"
import { authOptions } from "../auth/[...nextauth]"

export default async function getDailyLeaderboard(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session) {
            return res.status(401).send({
                message: "You must be logged in.",
            })
        }

        const client = await clientPromise
        const db = client.db("General")
        const accounts = db.collection("accounts")
        const linkedAccounts = db.collection("Linked Accounts")

        const userId = new ObjectId(session?.user?.id)

        const user = await accounts.findOne({
            userId,
        })

        if (!user) {
            return res.status(404).json({
                message: "Session Not Found",
            })
        }

        const linkedAccount = await linkedAccounts.findOne({
            discordID: user.providerAccountId,
        })

        if (!linkedAccount) {
            return res.status(404).json({
                message: "Linked Account Not Found",
            })
        }

        return res.status(200).json(linkedAccount)
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
