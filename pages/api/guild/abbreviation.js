import clientPromise from "../../../lib/mongodb"

export default async function addClan(req, res) {
  try {
    const { method, body } = req
    const { serverId, abbr, clanTag, clanName } = body

    if (method !== "PUT" && method !== "DELETE") {
      return res.status(405).send({
        message: "Wrong method. PUT & DELETE only accepted.",
      })
    }

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    await guilds.updateOne(
      {
        guildID: i.guildId,
      },
      {
        $push: {
          abbreviations: {
            abbr: abbreviation,
            tag: clan.tag,
            name: clan.name,
          },
        },
      }
    )

    return res.status(200).json({})
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}
