/* eslint-disable import/prefer-default-export */
import { NextResponse } from "next/server"
import { Logger } from "next-axiom"

import { formatSupercellResponse } from "@/actions/supercell"
import { getRaceDetails } from "@/lib/functions/race"
import { SUPERCELL_BASE_URL } from "@/static/constants"

export async function GET(req) {
  const tag = req.nextUrl.searchParams.get("tag")
  const getRaceStats = req.nextUrl.searchParams.get("getRaceStats")

  const calcRaceStats = getRaceStats === "true"

  try {
    const options = { headers: { Authorization: `Bearer ${process.env.CR_API_TOKEN}` } }
    const url = `/clans/%23${tag}/currentriverrace`

    const raceResp = await fetch(`${SUPERCELL_BASE_URL}${url}`, options)
    const formattedResp = await formatSupercellResponse(raceResp)

    const { data: race, error } = formattedResp

    let response

    if (calcRaceStats && !error && race) {
      response = NextResponse.json({ ...formattedResp, data: getRaceDetails(race) })
    } else response = NextResponse.json(formattedResp)

    return response
  } catch (err) {
    const log = new Logger()
    log.error("get-race Error", err)

    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
