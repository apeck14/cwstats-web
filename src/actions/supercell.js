"use server"

import { redirect } from "next/navigation"
import { Logger } from "next-axiom"

import { getLogDetails } from "@/lib/functions/race"
import { formatTag, getSupercellRedirectRoute } from "@/lib/functions/utils"
import clientPromise from "@/lib/mongodb"
import { HOST, SUPERCELL_BASE_URL } from "@/static/constants"

export const formatSupercellResponse = async (resp, redirectOnError) => {
  const { status } = resp

  if (status === 200) {
    const data = await resp.json()

    return {
      data: data.items ?? data,
      status,
    }
  }

  if (redirectOnError) redirect(getSupercellRedirectRoute(status))
  else {
    let error = "Unexpected error. Please try again."

    if (status === 404) error = "Not found."
    else if (status === 429) error = "API limit exceeded. Please try again later."
    else if (status === 503) error = "Maintenence break."

    return {
      error,
      status,
    }
  }
}

async function supercellRequest(url, redirectOnError) {
  const options = { cache: "no-store", headers: { Authorization: `Bearer ${process.env.CR_API_TOKEN}` } }
  let error = false

  try {
    const resp = await fetch(`${SUPERCELL_BASE_URL}${url}`, options)

    return formatSupercellResponse(resp, redirectOnError)
  } catch {
    if (!redirectOnError) return { error: "Unexpected error. Please try again.", status: 500 }
    error = true
  } finally {
    if (redirectOnError && error) redirect("/500_")
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
    const log = new Logger()
    log.error("addPlayer Error", err)
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

export async function getClan(tag) {
  return fetch(`${HOST}/api/clan?tag=${formatTag(tag)}`).then((res) => res.json())
}

export async function getRaceLog(tag, redirectOnError = false, getLogStats = false) {
  const formattedTag = formatTag(tag)
  const { data: log, error } = await supercellRequest(`/clans/%23${formattedTag}/riverracelog`, redirectOnError)

  if (!error && getLogStats) return { data: getLogDetails(`#${formattedTag}`, log) }

  return log
}

export async function getRace(tag, getRaceStats = false) {
  return fetch(`${HOST}/api/clan/race?tag=${formatTag(tag)}&getRaceStats=${getRaceStats}`, {
    next: { revalidate: 60 },
  }).then((res) => res.json())
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
