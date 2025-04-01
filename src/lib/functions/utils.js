import arenas from "@/static/arenas"
import badges from "@/static/badges.json"
import locations from "@/static/locations"

export const getSupercellRedirectRoute = (status) => {
  const redirectTo500 = status !== 404 && status !== 429 && status !== 503

  return redirectTo500 ? "/500_" : `/${status}_`
}

export const formatTag = (str, withHastag = false) => {
  const tag = str
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .replace(/O/g, "0")

  return `${withHastag ? "#" : ""}${tag}`
}

export const getClanBadgeFileName = (badgeId, trophyCount) => {
  if (badgeId === -1 || !badgeId) return "no_clan"

  const badgeName = badges.find((b) => b.id === badgeId)?.name

  if (!badgeName) return "no_clan"

  let league

  if (trophyCount >= 5000) league = "legendary-3"
  else if (trophyCount >= 4000) league = "legendary-2"
  else if (trophyCount >= 3000) league = "legendary-1"
  else if (trophyCount >= 2500) league = "gold-3"
  else if (trophyCount >= 2000) league = "gold-2"
  else if (trophyCount >= 1500) league = "gold-1"
  else if (trophyCount >= 1200) league = "silver-3"
  else if (trophyCount >= 900) league = "silver-2"
  else if (trophyCount >= 600) league = "silver-1"
  else if (trophyCount >= 400) league = "bronze-3"
  else if (trophyCount >= 200) league = "bronze-2"
  else league = "bronze-1"

  return `${badgeName}_${league}`
}

export const getCardFileName = (str) => str.toLowerCase().replace(/ /g, "-").replace(/\./g, "")

export const getCountryKeyById = (countryId) => {
  const countryKey = locations.find((l) => l.id === countryId)?.key

  if (countryKey) return countryKey.toLowerCase()

  return "unknown"
}

export const getRegionByKey = (key) => {
  if (!key) return false

  const formattedKey = key.toLowerCase()

  return locations.find((l) => l.key.toLowerCase() === formattedKey)
}

export const getRegionById = (id) => {
  if (!id) return false

  return locations.find((l) => l.id === id)
}

export const getArenaFileName = (arenaName) => {
  if (!arenaName) return "arena0"

  const { arena } = arenas.find((a) => a.name === arenaName) || {}

  return `arena${arena ?? 0}`
}

export const formatClanType = (type) => {
  if (type === "inviteOnly") return "Invite Only"
  if (type === "open") return "Open"

  return "Closed"
}

export const formatRole = (role) => {
  if (role === "elder") return "Elder"
  if (role === "member") return "Member"
  if (role === "coLeader") return "Co-Leader"

  return "Leader"
}

export const truncateString = (str, maxLength = 20) =>
  str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str

export const getShortenedDiscordServerName = (name) => {
  const words = name.split(" ")

  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()

  let shortName = ""

  for (const word of words) {
    shortName += word[0]
  }

  return shortName.toUpperCase()
}

export const mongoSanitize = (val) => {
  if (typeof val === "object" && val !== null) {
    for (const key in val) {
      if (key[0] === "$") {
        delete val[key]
      }
    }
  }
  return val
}

export const intToHex = (int) => {
  if (!int) return "#9aaab4"

  return `#${int.toString(16).padStart(6, "0")}`
}

export const getMedian = (arr) => {
  arr.sort((a, b) => a - b)

  const { length } = arr
  const middle = Math.floor(length / 2)

  if (length % 2 === 1) {
    return arr[middle]
  }
  return (arr[middle - 1] + arr[middle]) / 2
}

export const getAverage = (arr) => {
  if (!arr?.length) return 0

  const sum = arr.reduce((acc, num) => acc + num, 0)
  return sum / arr.length
}

export const formatDiscordStr = (clanName) =>
  clanName.replaceAll("*", "∗").replaceAll("_", "\\_").replaceAll("™️", "™")

export const calcNudgeLimit = (linkedPlusClansCount) => 3 + linkedPlusClansCount * 2

export const calcLinkedPlayerLimit = (linkedPlusClansCount) => 100 + linkedPlusClansCount * 75

// supercell search api behaves differently depending on params sent, so we remove params from the url that are invalid or default values
export const getClanSearchParams = (params) => {
  const newParams = {}

  for (const [key, value] of Object.entries(params)) {
    if (key === "limit") {
      const limit = parseInt(value)
      if (Number.isInteger(limit)) {
        newParams[key] = limit
      }
    } else if (key === "minScore") {
      const minScore = parseInt(value)
      if (Number.isInteger(minScore) && minScore > 0) {
        newParams[key] = minScore
      }
    } else if (key === "minMembers") {
      const minMembers = parseInt(value)
      if (Number.isInteger(minMembers) && minMembers > 2) {
        newParams[key] = minMembers
      }
    } else if (key === "maxMembers") {
      const maxMembers = parseInt(value)
      if (Number.isInteger(maxMembers) && maxMembers < 50) {
        newParams[key] = maxMembers
      }
    } else if (key === "name") {
      newParams[key] = value
    } else if (key === "trophies") {
      const trophies = parseInt(value)
      if (Number.isInteger(trophies) && trophies > 0) {
        newParams[key] = trophies
      }
    } else if (key === "locationId") {
      if (value !== "global") {
        const locationId = parseInt(value)
        if (Number.isInteger(locationId)) {
          newParams[key] = locationId
        }
      }
    }
  }

  return newParams
}
