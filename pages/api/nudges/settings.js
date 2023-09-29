import clientPromise from "../../../lib/mongodb"

export default async function scheduledNudge(req, res) {
  try {
    const { body } = req
    const { ignoreLeaders, message, serverId } = body

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists) return res.status(404).json({ message: "Server not found." })

    if (message.length > 200) {
      return res.status(400).json({ message: "Message cannot exceed 200 characters." })
    }

    await guilds.updateOne(
      { guildID: serverId },
      {
        $set: {
          "nudges.ignoreLeaders": ignoreLeaders,
          "nudges.message": message,
        },
      }
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Unexpected error. Please try again.",
    })
  }
}
