/* eslint-disable import/prefer-default-export */
import { NextResponse } from "next/server"
import { Logger } from "next-axiom"

import client from "../../../lib/mongodb"

export async function GET() {
  try {
    const db = client.db("General")
    const Statistics = db.collection("Statistics")

    const data = await Statistics.findOne({})

    return NextResponse.json(
      { fallers: data.fallers, risers: data.risers, success: true, topScores: data.topScores },
      { status: 200 },
    )
  } catch (err) {
    const log = new Logger()
    log.error("weekly-stats Error", err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
