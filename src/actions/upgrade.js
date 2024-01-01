"use server"

/* eslint-disable perfectionist/sort-objects */
/* eslint-disable import/prefer-default-export */

import clientPromise from "../lib/mongodb"
import { getClan } from "./supercell"

export async function addPlus(tag) {
  const { data: clan, error } = await getClan(tag)

  if (error) return { error }
  if (clan.members === 0) return { error: "Clan cannot have 0 members." }
  if (clan.clanWarTrophies < 3000) return { error: "Clan must be above 3000 war trophies." }

  // check description for "cwstats.com"
  const hasUrlInDescription = clan.description.toLowerCase().includes("cwstats.com")
  if (!hasUrlInDescription) return { error: 'Clan description must contain "CWStats.com".' }

  try {
    const client = await clientPromise
    const db = client.db("General")
    const plus = db.collection("CWStats+")

    const clanAlreadyPlus = await plus.findOne({ tag: clan.tag })

    if (clanAlreadyPlus) return { error: "Clan is already activated. 🎉" }

    await plus.insertOne({ tag: clan.tag, dailyAverages: [] })

    return { name: clan.name, tag: clan.tag }
  } catch {
    return { error: "Unexpected error. Please try again." }
  }
}
