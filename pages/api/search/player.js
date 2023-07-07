import clientPromise from "../../../lib/mongodb"

export async function getPlayersFromSearch(q, limit) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const players = db.collection("Players")

    const foundPlayers = await players
      .find({
        name: new RegExp(`.*${q}*.`, "i"),
      })
      .limit(Number(limit) || 50)
      .toArray()

    return { players: foundPlayers || [] }
  } catch ({ message }) {
    return { error: true, message }
  }
}

export default async function handler(req, res) {
  try {
    const { query } = req
    const { q, limit } = query

    const { error, message, players } = await getPlayersFromSearch(q, limit)

    if (error) throw message

    return res.status(200).json({ players })
  } catch ({ message }) {
    return res.status(500).json({
      message,
    })
  }
}
