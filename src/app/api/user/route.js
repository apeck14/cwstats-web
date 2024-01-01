/* eslint-disable import/prefer-default-export */
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import clientPromise from "../../../lib/mongodb"
import { authOptions } from "../auth/[...nextauth]/route"

/**
 * Get a user's linked account data from current session
 * @param {*} req
 * @param {*} res
 * @returns { discordID: string, tag: string, savedClans: [], savedPlayers: [] }
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) return NextResponse.json({}, { status: 403 })

    const client = await clientPromise
    const db = client.db("General")
    const accounts = db.collection("accounts")
    const linkedAccounts = db.collection("Linked Accounts")

    const userId = new ObjectId(session?.user?.id)

    const user = await accounts.findOne({
      userId,
    })

    if (!user) return NextResponse.json({}, { status: 404 })

    const linkedAccount = await linkedAccounts.findOne({
      discordID: user.providerAccountId,
    })

    if (!linkedAccount) return NextResponse.json({}, { status: 404 })

    return NextResponse.json({ success: true, ...linkedAccount }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
