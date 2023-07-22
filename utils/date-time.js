import moment, { tz, utc } from "moment-timezone"

import { gray, orange, red } from "../public/static/colors"

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
      date.substr(13, 2),
    ),
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

export const getLastSeenColor = (date) => {
  if (!date) return gray["25"]

  const diffMins = diffInMins(date)

  // < 1 day (default)
  if (diffMins < 1440) return gray["25"]

  // < 7 days
  if (diffMins < 10080) return orange

  // >= 7 days
  return red
}

export const getUsersTimezone = () => {
  const timezone = tz.guess()
  const offset = tz(timezone).format("Z")

  return { timezone, offset }
}

export const timestamptoHHMM = (timestamp) => {
  const timezone = tz.guess()

  const date = utc(timestamp).tz(timezone)

  return date.format("h:mm A z")
}

export const getTimeFromOffset = (hour) => {
  const usersTimezone = tz.guess()

  const now = moment().tz(usersTimezone)
  const year = now.year()
  const month = now.month()
  const day = now.date()

  const hourInteger = Math.floor(hour)
  const decimalOver = hour % Math.floor(hour)

  const date = utc(
    `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}T${
      hourInteger < 10 ? `0${hourInteger}` : hourInteger
    }:${decimalOver === 0 ? "00" : 60 * decimalOver}:00`,
  ).tz(usersTimezone)

  return date.format("h:mm A z")
}

export const convertHourToUTC = (hour, amPm) => {
  const hourIn24Time = amPm === "P.M." ? hour + 12 : hour
  const timezone = tz.guess()

  const now = moment().tz(timezone)
  const year = now.year()
  const month = now.month()
  const day = now.date()

  const date = tz(
    `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}T${
      hourIn24Time < 10 ? `0${hourIn24Time}` : hourIn24Time
    }:00:00`,
    timezone,
  ).utc()

  const hourUTC = date.hour()
  const minuteUTC = date.minute()

  return Number(hourUTC + minuteUTC / 60)
}
