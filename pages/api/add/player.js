import clientPromise from "../../../lib/mongodb"

export async function addPlayer({ name, tag, clanName }) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const players = db.collection("Players")

    const query = { tag }
    const update = { $set: { clanName, name } }
    const options = { upsert: true }

    await players.updateOne(query, update, options)

    return { success: true }
  } catch (err) {
    return { error: true, message: err.message }
  }
}

export default async function handler(req, res) {
  try {
    const { body } = req

    const { error, message } = await addPlayer(body)

    if (error) throw message

    return res.status(200).json({})
  } catch (message) {
    return res.status(500).json({
      message,
    })
  }
}
