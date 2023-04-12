import clientPromise from "../../../lib/mongodb"

export default async function addClan(req, res) {
  try {
    const { body } = req
    const { name, tag, badge } = body

    const client = await clientPromise
    const db = client.db("General")
    const clans = db.collection("Clans")

    const clanExists = await clans.findOne({
      tag,
    })

    if (!clanExists) {
      clans.insertOne({
        name,
        tag,
        badge,
      })
    } else if (clanExists.name !== name || clanExists.badge !== badge) {
      clans.updateOne(clanExists, {
        $set: {
          name,
          tag,
          badge,
        },
      })
    }

    return res.status(200).json({})
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}
