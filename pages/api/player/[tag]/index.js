// /api/clan/:tag
export default async function getPlayer(req, res) {
  try {
    const { query } = req
    const { tag } = query

    const resp = await fetch(`https://proxy.royaleapi.dev/v1/players/%23${tag}`, {
      headers: new Headers({
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
        "Content-Type": "application/json",
      }),
      method: "GET",
    })

    const data = await resp.json()

    return res.status(resp.status).send(data)
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
