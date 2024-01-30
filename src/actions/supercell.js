"use server"

import { redirect } from "next/navigation"

import { getRaceDetails } from "../lib/functions/race"
import { formatTag } from "../lib/functions/utils"
import clientPromise from "../lib/mongodb"

const BASE_URL = "https://proxy.royaleapi.dev/v1"

const formatSupercellResponse = async (resp, redirectOnError) => {
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

  const redirectTo500 = status !== 404 && status !== 429 && status !== 503

  if (redirectOnError) redirect(redirectTo500 ? "/500_" : `/${status}_`)

  return {
    error,
    status,
  }
}

async function supercellRequest(url, redirectOnError) {
  const options = { cache: "no-store", headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}` } }

  try {
    const resp = await fetch(`${BASE_URL}${url}`, options)

    return formatSupercellResponse(resp, redirectOnError)
  } catch {
    return { error: "Unexpected error. Please try again.", status: 500 }
  }
}

export async function addPlayer({ clanName, name, tag }) {
  if ((!clanName && clanName !== "") || !name || !tag) return

  try {
    const client = await clientPromise
    const db = client.db("General")
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

export async function getPlayer(tag, redirectOnError = false) {
  const player = await supercellRequest(`/players/%23${formatTag(tag)}`, redirectOnError)

  if (!player.error) {
    const {
      data: { clan, name, tag: pTag },
    } = player
    addPlayer({ clanName: clan ? clan.name : "", name, tag: pTag })
  }

  return player
}

export async function getPlayerBattleLog(tag, redirectOnError = false) {
  return supercellRequest(`/players/%23${formatTag(tag)}/battlelog`, redirectOnError)
}

export async function getClan(tag, redirectOnError = false) {
  return supercellRequest(`/clans/%23${formatTag(tag)}`, redirectOnError)
}

export async function getRaceLog(tag, redirectOnError = false) {
  return supercellRequest(`/clans/%23${formatTag(tag)}/riverracelog`, redirectOnError)
}

export async function getRace(tag, redirectOnError = false, getRaceStats = false) {
  const race = await supercellRequest(`/clans/%23${formatTag(tag)}/currentriverrace`, redirectOnError)

  if (!race.error && getRaceStats) {
    return {
      ...race,
      data: getRaceDetails(race.data),
    }
  }

  return race
}

export async function getClanMembers(tag, redirectOnError = false) {
  return supercellRequest(`/clans/%23${formatTag(tag)}/members`, redirectOnError)
}

export async function searchClans(query, sortByWarTrophies = true, limit = 5, redirectOnError = false) {
  const resp = await supercellRequest(`/clans?name=${encodeURIComponent(query)}`, redirectOnError)

  if (resp.status === 200) {
    if (sortByWarTrophies) {
      resp?.data?.sort((a, b) => b.clanWarTrophies - a.clanWarTrophies)
    }

    resp.data = resp?.data?.slice(0, limit)
  }

  return resp
}

export async function getWarLeaderboard(id, redirectOnError = false) {
  return supercellRequest(`/locations/${id}/rankings/clanwars`, redirectOnError)
}
