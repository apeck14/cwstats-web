import clientPromise from "../../../lib/mongodb"
import { formatTag, handleSCResponse } from "../../../utils/functions"
import { fetchPlayer } from "../../../utils/services"

export default async function scheduledNudge(req, res) {
  try {
    const { body, method } = req
    const { serverId, discordID, tag } = body

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    if (method !== "PUT" && method !== "POST") {
      return res.status(405).send({
        message: "Wrong method. PUT & POST only accepted.",
      })
    }

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists) return res.status(404).json({ message: "Server not found." })

    const formattedTag = formatTag(tag, true)

    if (method === "PUT") {
      if (guildExists?.nudges?.links?.length >= 300) {
        return res.status(403).json({ message: "Max linked accounts reached." })
      }

      const duplicateExists = guildExists?.nudges?.links?.some(
        (la) => la.tag === formattedTag && la.discordID === discordID
      )

      if (duplicateExists) {
        return res.status(409).json({ message: "No duplicate linked accounts." })
      }

      const player = await fetchPlayer(formattedTag.substring(1)).then(handleSCResponse)

      await guilds.updateOne(
        { guildID: serverId },
        {
          $push: {
            "nudges.links": {
              tag: player.tag,
              discordID,
              name: player.name,
            },
          },
        }
      )

      return res.status(200).json({ success: true, name: player.name })
    }

    // POST (remove item)
    await guilds.updateOne(
      { guildID: serverId },
      {
        $pull: {
          "nudges.links": {
            tag: formattedTag,
            discordID,
          },
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
