import badges from "../../../public/static/badges.json"
import locations from "../../../public/static/locations"

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

export const getArenaFileName = (arenaStr) => {
  if (!arenaStr) return "arena0"

  return arenaStr.toLowerCase().replace(/ /g, "")
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
