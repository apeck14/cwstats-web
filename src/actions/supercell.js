"use server"

import { formatTag } from "../lib/functions"
import clientPromise from "../lib/mongodb"

const BASE_URL = "https://proxy.royaleapi.dev/v1"

const formatSupercellResponse = async (resp) => {
  const { status } = resp

  if (status === 200) {
    const data = await resp.json()

    return {
      data: data.items ?? data,
      status,
    }
  }

  let error = "Unexpected error. Please try again."

  if (status === 404) error = "Not found."
  else if (status === 429) error = "API limit exceeded. Please try again later."
  else if (status === 503) error = "Maintenence break."

  return {
    error,
    status,
  }
}

async function supercellRequest(url) {
  const options = { cache: "no-store", headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}` } }

  try {
    const resp = await fetch(`${BASE_URL}${url}`, options)

    return formatSupercellResponse(resp)
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function addPlayer({ clanName, name, tag }) {
  if (!clanName || !name || !tag) return

  try {
    const db = await clientPromise
    const players = db.collection("Players")

    const query = { tag }
    const update = { $set: { clanName, name, tag } }
    const options = { upsert: true }

    players.updateOne(query, update, options)
  } catch (err) {
    console.log("Error adding player to db...")
    console.log(err)
  }
}

export async function getClan(tag) {
  return supercellRequest(`/clans/%23${formatTag(tag)}`)
}

export async function getPlayerBattleLog(tag) {
  return supercellRequest(`/players/%23${formatTag(tag)}/battlelog`)

  // add player
}

export async function searchClans(query, sortByWarTrophies = true, limit = 5) {
  const resp = await supercellRequest(`/clans?name=${encodeURIComponent(query)}`)

  if (resp.status === 200) {
    if (sortByWarTrophies) {
      resp?.data?.sort((a, b) => b.clanWarTrophies - a.clanWarTrophies)
    }

    resp.data = resp?.data?.slice(0, limit)
  }

  return resp
}
