/* eslint-disable import/prefer-default-export */
import { getToken } from "next-auth/jwt"

import { API_BASE_URL } from "../../../../../public/static/constants"
import { formatTag } from "../../../../lib/functions/utils"

export async function POST(req) {
  try {
    const { clanTag } = await req.json()

    // Get NextAuth JWT
    const userToken = await getToken({
      raw: true,
      req,
    })

    if (!userToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      })
    }

    const response = await fetch(`${API_BASE_URL}/pro/checkout`, {
      body: JSON.stringify({ clanTag: formatTag(clanTag, false) }),
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
        "Content-Type": "application/json",
        "x-user-token": userToken,
      },
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify(data), { status: response.status })
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ details: err, error: "Internal Server Error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
}
