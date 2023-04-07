// /api/clan/:tag
export default async function getClan(req, res) {
    try {
        const { query } = req
        const { tag } = query

        const resp = await fetch(
            `https://proxy.royaleapi.dev/v1/clans/%23${tag}`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + process.env.NEXT_PUBLIC_CR_API_TOKEN,
                }),
            }
        )

        const data = await resp.json()

        return res.status(resp.status).send(data)
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
