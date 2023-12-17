import clientPromise from "../../../lib/mongodb"
import { formatTag, handleSCResponse } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"

export default async function putAbbreviation(req, res) {
  try {
    const { body } = req
    const { abbr, clanTag, serverId } = body

    const client = await clientPromise
    const db = client.db("General")
    const guilds = db.collection("Guilds")

    const guildExists = await guilds.findOne({
      guildID: serverId,
    })

    if (!guildExists) return res.status(404).json({ message: "Server not found." })

    const { abbreviations } = guildExists

    if (abbreviations.length >= 15) {
      return res.status(400).json({ message: "Max number of abbreviations reached." })
    }

    if (abbr.length > 4) {
      return res.status(400).json({
        message: "Abbreviation cannot be larger than 4 characters.",
      })
    }

    if (!abbr.match(/^[0-9a-zA-Z]+$/)) {
      return res.status(400).json({ message: "Abbreviation must be alphanumeric." })
    }

    const uppercaseAbbr = abbr.toUpperCase()

    if (abbreviations.find((a) => a.abbr.toUpperCase() === uppercaseAbbr)) {
      return res.status(400).json({
        message: "This abbreviation is already in use.",
      })
    }

    const formattedTag = formatTag(clanTag, true)

    if (abbreviations.find((a) => a.tag === formattedTag))
      return res.status(500).json({
        message: "This clan is already in use.",
      })

    const clan = await fetchClan(formattedTag.substr(1)).then(handleSCResponse)

    await guilds.updateOne(
      {
        guildID: serverId,
      },
      {
        $push: {
          abbreviations: {
            abbr,
            name: clan.name,
            tag: clan.tag,
          },
        },
      },
    )
    return res.status(200).json({ name: clan.name, success: true })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Unexpected error. Please try again.",
    })
  }
}
