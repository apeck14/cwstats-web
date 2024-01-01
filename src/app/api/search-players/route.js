/* eslint-disable import/prefer-default-export */
import { NextResponse } from "next/server"
import * as Realm from "realm-web"

/**
 * Search database by player name
 * @param req: { query, limit }
 * @returns { players: [] }
 */

export async function GET(req) {
  try {
    const query = req.nextUrl.searchParams.get("q")
    const limit = Number(req.nextUrl.searchParams.get("limit"))

    const realmApp = new Realm.App({ id: process.env.NEXT_PUBLIC_REALM_APP_ID })
    const realmCredentials = Realm.Credentials.anonymous()
    const realm = await realmApp.logIn(realmCredentials)

    const players = await realm.functions.searchPlayerNames(query, limit)

    return NextResponse.json({ players: players ?? [], success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
