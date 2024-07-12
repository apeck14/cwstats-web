/* eslint-disable import/prefer-default-export */
import { NextResponse } from "next/server"
import { Logger } from "next-axiom"

import { formatSupercellResponse } from "@/actions/supercell"
import { SUPERCELL_BASE_URL } from "@/static/constants"

export async function GET(req) {
  const tag = req.nextUrl.searchParams.get("tag")

  try {
    const options = { headers: { Authorization: `Bearer ${process.env.CR_API_TOKEN}` } }
    const url = `/clans/%23${tag}`

    const clanResp = await fetch(`${SUPERCELL_BASE_URL}${url}`, options)
    const clan = await formatSupercellResponse(clanResp)

    const response = NextResponse.json(clan)

    return response
  } catch (err) {
    const log = new Logger()
    log.error("get-clan Error", err)

    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
