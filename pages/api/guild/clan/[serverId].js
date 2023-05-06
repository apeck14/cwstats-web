import clientPromise from "../../../../lib/mongodb"

export default async function deleteDefaultClan(req, res) {
  try {
    const { query } = req
    const { serverId } = query

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists)
      return res.status(404).json({ message: "Server not found." })

    const { defaultClan } = guildExists

    if (!defaultClan)
      return res.status(404).json({ message: "No default clan not set." })

    await guilds.updateOne(
      {
        guildID: serverId,
      },
      {
        $unset: {
          defaultClan: "",
        },
      }
    )

    return res.status(200).json({ success: true })
  } catch ({ status, message }) {
    return res.status(status || 500).json({
      message: message || "Unexpected error. Please try again.",
    })
  }
}
