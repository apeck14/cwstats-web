/* eslint-disable perfectionist/sort-objects */
import badges from "../../public/static/badges.json"

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
