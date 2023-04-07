import clientPromise from "../../../../lib/mongodb.js"
import locations from "../../../../public/static/locations.js"

// /api/leaderboard/daily/:id
export default async function getDailyLeaderboard(req, res) {
    try {
        const { query } = req
        const { id: idStr, limit, minTrophies, maxTrophies } = query

        const id = idStr === "global" ? "global" : Number(idStr)

        const regionNotFound = !idStr || !locations.find((l) => l.id === id)

        if (regionNotFound) {
            return res.status(404).json({
                message: "Region not found.",
            })
        }

        const client = await clientPromise
        const db = client.db("General")
        const dailyLb = db.collection("Daily Clan Leaderboard")
        const statistics = db.collection("Statistics")

        const dailyLbQuery =
            id === "global"
                ? {}
                : {
                      "location.id": id,
                  }

        const limitQuery = Number(limit) || 0

        const [dailyLbArr, statsData] = await Promise.all([
            dailyLb
                .find({
                    ...dailyLbQuery,
                    clanScore: {
                        $gte: Number(minTrophies) || 0,
                        $lte: Number(maxTrophies) || 10000,
                    },
                })
                .sort({
                    fameAvg: -1,
                    rank: 1,
                    clanScore: -1,
                })
                .limit(limitQuery)
                .toArray(),
            statistics.findOne(),
        ])

        res.status(200).json({
            dailyLbArr,
            lbLastUpdated: statsData.lbLastUpdated,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
