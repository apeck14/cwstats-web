/* eslint-disable perfectionist/sort-objects */
import badges from "../../public/static/badges.json"
import locations from "../../public/static/locations"

export const breakpointObj = (xs, sm, md, lg, xl) => {
  const props = {
    xs,
    sm,
    md,
    lg,
    xl,
  }

  // if all props given, return early
  if (xl) return props

  // not all props given, fill remainder
  const filledObj = {}
  const breakpoints = Object.keys(props)

  for (const key of breakpoints) {
    if (props[key]) filledObj[key] = props[key]
    else {
      const currentIndex = breakpoints.indexOf(key)

      for (const fill of breakpoints.slice(currentIndex)) {
        filledObj[fill] = props[breakpoints[currentIndex - 1]]
      }

      return filledObj
    }
  }
}

export const formatTag = (str, withHastag = false) => {
  const tag = str
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .replace(/O/g, "0")

  return `${withHastag ? "#" : ""}${tag}`
}

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

export const getCardFileName = (str) => str.toLowerCase().replace(/ /g, "-").replace(/\./g, "")

const getTagFromURL = (url) => {
  const routeType = url.includes("clan") ? "clan" : "player"
  const tagPlusPage = url.substring(url.indexOf(routeType) + routeType.length + 1)

  const indexOfSlash = tagPlusPage.indexOf("/")
  if (indexOfSlash >= 0) {
    // remove everything after first /
    return tagPlusPage.substring(0, indexOfSlash)
  }

  return tagPlusPage
}

export const getTagFromHeaders = (headers) => {
  const url = headers.get("x-url")
  return getTagFromURL(url)
}

export const getCountryKeyById = (countryId) => {
  const countryKey = locations.find((l) => l.id === countryId)?.key

  if (countryKey) return countryKey.toLowerCase()

  return "unknown"
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

export const relativeDateStr = (date, showSeconds = true) => {
  if (!(date instanceof Date)) return "0m"

  const now = new Date()

  let diffMs = now.getTime() - date.getTime()

  let str = ""

  // check for weeks
  const diffWeeks = parseInt(diffMs / (1000 * 60 * 60 * 24 * 7))
  if (diffWeeks) {
    str += `${diffWeeks}w `
    diffMs -= diffWeeks * (1000 * 60 * 60 * 24 * 7)
  }

  // check for days
  const diffDays = parseInt(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays) {
    str += `${diffDays}d `
    diffMs -= diffDays * (1000 * 60 * 60 * 24)
  }

  // return '1w 3d'
  if (diffWeeks >= 1) return str.trim()

  // check for hours
  const diffHours = parseInt(diffMs / (1000 * 60 * 60))
  if (diffHours) {
    str += `${diffHours}h `
    diffMs -= diffHours * (1000 * 60 * 60)
  }

  // check for mins
  const diffMins = parseInt(diffMs / (1000 * 60))
  if (diffMins) {
    str += `${diffMins}m `
    diffMs -= diffMins * (1000 * 60)
  }

  if (showSeconds) {
    // check for secs
    const diffSecs = parseInt(diffMs / 1000)
    if (diffSecs) {
      str += `${diffSecs}s `
      diffMs -= diffSecs * 1000
    }
  }

  return str.trim() || "0m"
}

export const parseDate = (date) => {
  if (date instanceof Date) return date

  return new Date(
    Date.UTC(
      date.substr(0, 4),
      date.substr(4, 2) - 1,
      date.substr(6, 2),
      date.substr(9, 2),
      date.substr(11, 2),
      date.substr(13, 2),
    ),
  )
}

export const diffInMins = (timeInteger) => {
  const now = Date.now()

  return Math.round((now - timeInteger) / 1000 / 60)
}

export const getLastSeenColor = (date) => {
  if (!date) return "var(--mantine-color-text)"

  const diffMins = diffInMins(date)

  // < 1 day (default)
  if (diffMins < 1440) return "var(--mantine-color-text)"

  // < 7 days
  if (diffMins < 10080) return "yellow.6"

  // >= 7 days
  return "red.6"
}
