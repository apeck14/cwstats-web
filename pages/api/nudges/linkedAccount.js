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

      const tagExists = guildExists?.nudges?.links?.some((la) => la.tag === formattedTag)

      if (tagExists) {
        return res
          .status(409)
          .json({ message: "This tag is already linked to a Discord user." })
      }

      const player = await fetchPlayer(formattedTag.substring(1)).then(handleSCResponse)

      await guilds.updateOne(
        { guildID: serverId },
        {
          $push: {
            "nudges.links": {
              discordID,
              name: player.name,
              tag: player.tag,
            },
          },
        }
      )

      return res.status(200).json({ name: player.name, success: true })
    }

    // POST (remove item)
    await guilds.updateOne(
      { guildID: serverId },
      {
        $pull: {
          "nudges.links": {
            discordID,
            tag: formattedTag,
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
