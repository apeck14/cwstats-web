import { tz, utc } from "moment-timezone"

export const diffInMins = (timeInteger) => {
  const now = Date.now()

  return Math.round((now - timeInteger) / 1000 / 60)
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
      date.substr(13, 2)
    )
  )
}

export const relativeDateStr = (date, showSeconds = true) => {
  if (!(date instanceof Date)) return ""

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

  if (!showSeconds) return str.trim()

  // check for mins
  const diffSecs = parseInt(diffMs / 1000)
  if (diffSecs) {
    str += `${diffSecs}s `
    diffMs -= diffSecs * 1000
  }

  return str.trim()
}

export const getUsersTimezone = () => {
  const timezone = tz.guess()
  const offset = tz(timezone).format("Z")

  return { timezone, offset }
}

export const getTimeFromOffset = (hour) => {
  const usersTimezone = tz.guess()

  const date = utc(`2000-1-1 ${hour}:00`).tz(usersTimezone)

  return date.format("h:mm A z")
}
