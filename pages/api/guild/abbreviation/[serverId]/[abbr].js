import clientPromise from "../../../../../lib/mongodb"

export default async function abbreviation(req, res) {
  try {
    const { query } = req
    const { abbr, serverId } = query

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists) return res.status(404).json({ message: "Server not found." })

    const { abbreviations } = guildExists

    const abbrExists = abbreviations.find((a) => a.abbr === abbr)

    if (!abbrExists) {
      return res.status(404).json({ message: "Abbreviation does not exist." })
    }

    await guilds.updateOne(
      {
        guildID: serverId,
      },
      {
        $pull: {
          abbreviations: {
            abbr,
          },
        },
      },
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Unexpected error. Please try again.",
    })
  }
}
