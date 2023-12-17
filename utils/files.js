import arenas from "../public/static/arenas"
import badges from "../public/static/badges.json"
import locations from "../public/static/locations"

export const getClanBadgeFileName = (badgeId, trophyCount) => {
  if (badgeId === -1 || badgeId === null) return "no_clan"

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

export const getArenaFileName = (trophies) => {
  if (!trophies || Number.isNaN(trophies)) return "arena0"

  for (const a of arenas) if (trophies >= a.trophyLimit) return `arena${a.arena}`
}

export const getCountryKeyById = (countryId) => {
  const countryKey = locations.find((l) => l.id === countryId)?.key

  if (countryKey) return countryKey.toLowerCase()

  return "unknown"
}

export const getRegionByKey = (key) => {
  if (!key) return false

  return locations.find((l) => l.key === key)
}

export const getBadgeHeightMultiplier = (badgeName) => {
  const lastChar = badgeName.charAt(badgeName.length - 1)

  if (lastChar === "3" || lastChar === "2") return 1.3
  if (lastChar === "1") return 1.45

  // no_clan
  return 1.25
}
