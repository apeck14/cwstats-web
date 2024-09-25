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

export const getUTCOffset = (timezone) => {
  const offset = new Intl.DateTimeFormat("en", { timeZone: timezone, timeZoneName: "shortOffset" })
    .formatToParts()
    .find((part) => part.type === "timeZoneName").value

  const offsetStr = offset.replace("GMT", "")

  return offsetStr ? parseInt(offsetStr) : 0
}
