import clientPromise from "../../../lib/mongodb"

export default async function postChannels(req, res) {
  try {
    const { body } = req
    const { channels, serverId } = body

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists) return res.status(404).json({ message: "Server not found." })

    await guilds.updateOne(
      {
        guildID: serverId,
      },
      {
        $set: { channels },
      },
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({
      message: err.message || "Unexpected error. Please try again.",
    })
  }
}
