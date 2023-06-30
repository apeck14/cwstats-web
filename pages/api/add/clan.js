import clientPromise from "../../../lib/mongodb"

export async function addClan({ name, tag, badge }) {
  try {
    const client = await clientPromise
    const db = client.db("General")
    const clans = db.collection("Clans")

    const query = { tag }
    const update = { $set: { name, tag, badge } }
    const options = { upsert: true }

    await clans.updateOne(query, update, options)

    return { success: true }
  } catch (err) {
    return { error: true, message: err.message }
  }
}

export default async function handler(req, res) {
  try {
    const { body } = req

    const { error, message } = await addClan(body)

    if (error) throw message

    return res.status(200).json({})
  } catch (message) {
    return res.status(500).json({
      message,
    })
  }
}
