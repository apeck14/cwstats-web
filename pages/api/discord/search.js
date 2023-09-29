export default async function searchGuildMembers(req, res) {
  try {
    const { query } = req
    const { serverId, query: search } = query

    const resp = await fetch(
      `https://discordapp.com/api/guilds/${serverId}/members/search?query=${search}&&limit=5`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    )

    const data = await resp.json()

    if (!Array.isArray(data)) {
      return res.status(406).json({
        message: "Unexpected response from Discord.",
      })
    }

    return res.status(200).json(
      data.map((m) => ({
        global_name: m.user.global_name,
        id: m.user.id,
        username: m.user.username,
      }))
    )
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
