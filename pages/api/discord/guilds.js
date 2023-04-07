//get all guilds for a user
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import clientPromise from "../../../lib/mongodb"
import { authOptions } from "../auth/[...nextauth]"

export default async function getGuilds(req, res) {
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

        const userId = new ObjectId(session?.user?.id)

        const user = await accounts.findOne({
            userId,
        })

        if (!user) {
            return res.status(404).json({
                message: "Session Not Found",
            })
        }

        const resp = await fetch(
            "https://discordapp.com/api/users/@me/guilds",
            {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            }
        )

        const data = await resp.json()

        if (!Array.isArray(data)) {
            return res.status(406).json({
                message: "Unexpected response from Discord.",
            })
        }

        return res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
