export async function getClansFromSearch(q, limit = 50) {
  try {
    const resp = await fetch(
      `https://proxy.royaleapi.dev/v1/clans?name=${encodeURIComponent(q)}&limit=${limit}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
        }),
      }
    )

    const data = await resp.json()

    return { clans: data?.items || [] }
  } catch (err) {
    return { error: true, message: err.message }
  }
}

export default async function handler(req, res) {
  try {
    const { error, message, clans } = await getClansFromSearch(req)

    if (error) throw message

    return res.status(200).json(clans)
  } catch ({ message }) {
    return res.status(500).json({
      message,
    })
  }
}
