import clientPromise from "../../../lib/mongodb"
import { formatTag, handleSCResponse } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"

export default async function scheduledNudge(req, res) {
  try {
    const { body, method } = req
    const { channelID, clanTag, scheduledHourUTC, serverId } = body

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

    if (method === "PUT") {
      if (guildExists?.nudges?.scheduled?.length >= 5) {
        return res.status(403).json({ message: "Max scheduled nudges reached." })
      }

      const duplicateExists = guildExists?.nudges?.scheduled?.find(
        (sn) => sn.clanTag === clanTag && sn.scheduledHourUTC === scheduledHourUTC
      )

      if (duplicateExists) {
        return res.status(409).json({ message: "No duplicate scheduled nudges." })
      }

      const clan = await fetchClan(clanTag.substring(1)).then(handleSCResponse)

      await guilds.updateOne(
        { guildID: serverId },
        {
          $push: {
            "nudges.scheduled": {
              channelID,
              clanName: clan.name,
              clanTag: clan.tag,
              scheduledHourUTC,
            },
          },
        }
      )

      return res.status(200).json({ clanName: clan.name, success: true })
    }

    // POST (remove item)
    await guilds.updateOne(
      { guildID: serverId },
      {
        $pull: {
          "nudges.scheduled": {
            clanTag: formatTag(clanTag, true),
            scheduledHourUTC,
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
