// get all guilds for a user
import clientPromise from "../../../lib/mongodb"

export default async function getClansFromSearch(req, res) {
    try {
        const { query } = req
        const { q } = query

        const client = await clientPromise
        const db = client.db("General")
        const clans = db.collection("Clans")

        const foundClans = await clans
            .find({
                name: new RegExp(`.*${q}*.`, "i"),
            })
            .limit(50)
            .toArray()

        return res.status(200).json(foundClans)
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
