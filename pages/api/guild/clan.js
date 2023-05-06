import clientPromise from "../../../lib/mongodb"
import { formatTag, handleSCResponse } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"

export default async function postDefaultClan(req, res) {
  try {
    const { body } = req
    const { clanTag, serverId } = body

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists)
      return res.status(404).json({ message: "Server not found." })

    const { defaultClan } = guildExists

    const formattedTag = formatTag(clanTag, true)

    if (defaultClan && defaultClan.tag === formattedTag) {
      return res.status(500).json({ message: "This clan is already set." })
    }

    const clan = await fetchClan(formattedTag.substr(1)).then(handleSCResponse)

    await guilds.updateOne(
      {
        guildID: serverId,
      },
      {
        $set: {
          defaultClan: {
            tag: clan.tag,
            name: clan.name,
          },
        },
      }
    )

    return res.status(200).json({ success: true, name: clan.name })
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({
      message: err.message || "Unexpected error. Please try again.",
    })
  }
}
