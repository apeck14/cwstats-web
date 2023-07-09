import {
  bronze,
  bronzeOrange,
  goldOrange,
  goldYellow,
  gray,
  silver,
  silverWhite,
} from "../public/static/colors"
import specialGamemodes from "../public/static/special-gamemodes"
import { parseDate } from "./date-time"

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

// convert all O's to 0, remove all non-alphanumeric
export const formatTag = (tag, withHashtag = false) => {
  const newTag = tag
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/O/g, "0")
    .toUpperCase()

  if (withHashtag) return `#${newTag}`

  return newTag
}

export const formatRaceIndex = (type, periodIndex) => {
  const dayType = type === "training" ? "Training" : "Battle"
  const dayOfWeek = (periodIndex % 7) + 1
  const dayInterval = type === "training" ? dayOfWeek : dayOfWeek - 3

  return `${dayType} Day ${dayInterval}`
}

export const getBattleDaysCompleted = (isColosseum, dayOfWeek) => {
  if (!isColosseum || dayOfWeek <= 3) return 0
  return dayOfWeek - 3
}

export const getAvgFame = (clan, isColosseum, dayOfWeek) => {
  const attacksCompletedToday = clan.participants.reduce(
    (a, b) => a + b.decksUsedToday,
    0
  )
  const currentFame = isColosseum ? clan.fame : clan.periodPoints
  const isTraining = dayOfWeek <= 3
  const battleDaysCompleted = !isColosseum || isTraining ? 0 : dayOfWeek - 3

  if (isColosseum) {
    if (attacksCompletedToday === 0 && battleDaysCompleted === 0) return 0

    return currentFame / (attacksCompletedToday + 200 * battleDaysCompleted)
  }

  if (attacksCompletedToday === 0) return 0

  return currentFame / attacksCompletedToday
}

export const getAvgFameOfLog = (clan, weekEnd, finishTime) => {
  const weekEndDate = parseDate(weekEnd)
  const finishDate = parseDate(finishTime)

  weekEndDate.setUTCDate(weekEndDate.getUTCDate() - 1)

  const threeDayFinish = weekEndDate.getUTCDate() === finishDate.getUTCDate()

  const totalFame = clan.participants.reduce((a, b) => a + b.fame, 0)

  return totalFame / (threeDayFinish ? 600 : 800)
}

export const placementStr = (placement) => {
  if (placement === 1) return "1st"
  if (placement === 2) return "2nd"
  if (placement === 3) return "3rd"
  if (placement === 4) return "4th"
  if (placement === 5) return "5th"
  return "N/A"
}

export const getProjFame = (clan, isColosseum, dayOfWeek) => {
  if (!clan) return "N/A"

  const movementPoints = isColosseum ? clan.periodPoints : clan.fame
  const fame = isColosseum ? clan.fame : clan.periodPoints
  const multiple = fame % 10 === 0 ? 50 : 25

  if (!isColosseum && movementPoints >= 10000) return 0

  const maxDuelsCompletedToday = clan.participants.filter(
    (p) => p.decksUsedToday >= 2
  ).length
  const attacksCompletedToday = clan.participants.reduce(
    (a, b) => a + b.decksUsedToday,
    0
  )
  const isTraining = dayOfWeek <= 3
  const battleDaysCompleted = !isColosseum || isTraining ? 0 : dayOfWeek - 3

  const totalPossibleFame = () => {
    if (!isColosseum && movementPoints >= 10000) return 0

    const duelsRemainingToday = 50 - maxDuelsCompletedToday
    const totalAttacksRemaining = 200 - attacksCompletedToday
    let maxPossibleFame =
      fame +
      duelsRemainingToday * 500 +
      (totalAttacksRemaining - duelsRemainingToday * 2) * 200 // max fame today

    if (isColosseum) {
      maxPossibleFame += 45000 * (3 - battleDaysCompleted)

      return maxPossibleFame > 180000 ? 180000 : maxPossibleFame
    }

    return maxPossibleFame > 45000 ? 45000 : maxPossibleFame
  }

  let currentPossibleFame =
    maxDuelsCompletedToday * 500 +
    (attacksCompletedToday - maxDuelsCompletedToday * 2) * 200
  let winRate = fame / currentPossibleFame

  if (isColosseum) {
    if (attacksCompletedToday === 0 && battleDaysCompleted === 0) return 0

    currentPossibleFame += 45000 * battleDaysCompleted
    winRate = fame / currentPossibleFame

    const projFame = fame + (totalPossibleFame() - fame) * winRate

    return projFame > 180000 ? 180000 : Math.ceil(projFame / 50) * 50
  }

  if (attacksCompletedToday === 0) return 0
  const projFame = fame + (totalPossibleFame() - fame) * winRate

  return projFame > 45000 ? 45000 : Math.ceil(projFame / multiple) * multiple
}

export const getRaceDetails = (race, isColosseum) => {
  if (!race) return []

  const fameAccessor = isColosseum ? "fame" : "periodPoints"
  const boatAccessor = isColosseum ? "periodPoints" : "fame"

  const newRace = race.map((c) => ({
    name: c.name,
    tag: c.tag,
    fame: c[fameAccessor],
    boatPoints: c[boatAccessor],
    badgeId: c.badgeId,
    trophies: c.clanScore,
    placement: Infinity,
    crossedFinishLine: c[boatAccessor] >= 10000,
  }))

  const clansWithPointsSorted = newRace
    .filter((cl) => cl.fame > 0)
    .sort((a, b) => b.fame - a.fame)

  let place = 1

  for (let i = 0; i < clansWithPointsSorted.length; i++) {
    const clan = clansWithPointsSorted[i]

    if (clan.crossedFinishLine) continue

    const clansWithSameFame = [clan.tag]

    for (let x = i + 1; x < clansWithPointsSorted.length; x++) {
      const nextClan = clansWithPointsSorted[x]
      if (nextClan.fame === clan.fame) clansWithSameFame.push(nextClan.tag)
    }

    for (const c of clansWithSameFame)
      newRace.find((cl) => c === cl.tag).placement = place

    i += clansWithSameFame.length - 1
    place += clansWithSameFame.length
  }

  return newRace.sort((a, b) => {
    if (a.crossedFinishLine === b.crossedFinishLine) return a.placement - b.placement

    return b.crossedFinishLine - a.crossedFinishLine
  })
}

export const getCurrentPlacements = (race) => {
  const newRace = [...race]

  newRace
    .filter((c) => c.fame === 0)
    .forEach((c) => {
      newRace.find((cl) => c.tag === cl.tag).placement = Infinity
    })

  const clansWithPointsSorted = newRace
    .filter((cl) => cl.fame > 0)
    .sort((a, b) => b.fame - a.fame)
  let place = 1

  for (let i = 0; i < clansWithPointsSorted.length; i++) {
    const clansWithSameFame = [clansWithPointsSorted[i].tag]

    for (let x = i + 1; x < clansWithPointsSorted.length; x++)
      if (clansWithPointsSorted[x].fame === clansWithPointsSorted[i].fame)
        clansWithSameFame.push(clansWithPointsSorted[x].tag)

    for (const c of clansWithSameFame)
      newRace.find((cl) => c === cl.tag).placement = place

    i += clansWithSameFame.length - 1
    place += clansWithSameFame.length
  }

  return newRace
}

export const getBattlesRemaining = (participants) =>
  200 - participants.reduce((a, b) => a + b.decksUsedToday, 0)

export const getDuelsRemaining = (participants) =>
  50 - participants.filter((p) => p.decksUsedToday >= 2).length

export const getMaxFame = (clan, isColosseum, dayOfWeek) => {
  if (!clan) return "N/A"

  const movementPoints = isColosseum ? clan.periodPoints : clan.fame
  const fame = isColosseum ? clan.fame : clan.periodPoints

  if (!isColosseum && movementPoints >= 10000) return 0

  const duelsRemainingToday =
    50 - clan.participants.filter((p) => p.decksUsedToday >= 2).length
  const totalAttacksRemaining =
    200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0) // today
  let maxPossibleFame =
    fame +
    duelsRemainingToday * 500 +
    (totalAttacksRemaining - duelsRemainingToday * 2) * 200 // max fame today

  if (isColosseum) {
    const battleDaysComp = getBattleDaysCompleted(isColosseum, dayOfWeek)
    maxPossibleFame += 45000 * (3 - battleDaysComp)

    return maxPossibleFame > 180000 ? 180000 : maxPossibleFame
  }

  return maxPossibleFame > 45000 ? 45000 : maxPossibleFame
}

export const getMinFame = (clan, isColosseum, dayOfWeek) => {
  if (!clan) return "N/A"

  const movementPoints = isColosseum ? clan.periodPoints : clan.fame
  const fame = isColosseum ? clan.fame : clan.periodPoints

  if (!isColosseum && movementPoints >= 10000) return 0

  let totalAttacksRemaining =
    200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0)

  if (isColosseum)
    totalAttacksRemaining += 200 * (3 - getBattleDaysCompleted(isColosseum, dayOfWeek))

  return fame + totalAttacksRemaining * 100
}

export const getProjPlace = (race, isColosseum, dayOfWeek) => {
  if (!race || !race.clans) return "N/A"

  const clanProjections = race.clans.map((c) => ({
    tag: c.tag,
    fame: getProjFame(c, isColosseum, dayOfWeek),
  }))

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return placementStr(placement)
}

export const getBestPlace = (race, isColosseum, dayOfWeek) => {
  if (!race || !race.clans) return "N/A"

  const movementPtsAccessor = isColosseum ? "periodPoints" : "fame"

  if (race.clan[movementPtsAccessor] >= 10000) return "N/A"

  const clanProjections = race.clans.map((c) => {
    if (c.tag === race.clan.tag) {
      return {
        tag: c.tag,
        fame: getMaxFame(c, isColosseum, dayOfWeek),
      }
    }
    return {
      tag: c.tag,
      fame: getMinFame(c, isColosseum, dayOfWeek),
    }
  })

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return placementStr(placement)
}

export const getWorstPlace = (race, isColosseum, dayOfWeek) => {
  if (!race || !race.clans) return "N/A"

  const movementPtsAccessor = isColosseum ? "periodPoints" : "fame"

  if (race.clan[movementPtsAccessor] >= 10000) return "N/A"

  const clanProjections = race.clans.map((c) => {
    if (c.tag === race.clan.tag) {
      return {
        tag: c.tag,
        fame: getMinFame(c, isColosseum, dayOfWeek),
      }
    }
    return {
      tag: c.tag,
      fame: getMaxFame(c, isColosseum, dayOfWeek),
    }
  })

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return placementStr(placement)
}

const supportedCodes = [
  404, // not found
  429, // rate limit
  503, // maintenance break
]

export const handleCRError = (err, router) => {
  console.log(err)
  const { status } = err

  if (supportedCodes.includes(status)) router.push(`/${status}`)
  else router.push("/500")
}

export const getCRErrorUrl = (err) => {
  const { status } = err

  if (supportedCodes.includes(status)) return `/${status}`
  if (status) return "/500"

  return "/"
}

export const handleSCResponse = async (res) => {
  const data = await res.json()

  if (res.ok) return data.items || data

  throw {
    status: res.status,
    message: res.statusText,
  }
}

export const getBorderColor = (rank) => {
  if (rank === 1) return goldYellow
  if (rank === 2) return silverWhite
  if (rank === 3) return bronzeOrange

  return gray["25"]
}

export const getBackgroundColor = (rank) => {
  if (rank === 1) return goldOrange
  if (rank === 2) return silver
  if (rank === 3) return bronze

  return gray["50"]
}

export const redirect = (destination, permanent = false) => ({
  redirect: {
    destination,
    permanent,
  },
})

export const arraysAreEqual = (a, b) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, index) => val === b[index])

const sharesCards = (cards1, cards2) => {
  for (const c of cards1) {
    if (cards2.includes(c)) return true
  }

  return false
}

const addDeck = (cards, playerDecks, img, type = "other") => {
  const allPlayerDecks = [...playerDecks.duel, ...playerDecks.other]

  for (const d of allPlayerDecks) {
    if (sharesCards(cards, d.cards)) return
  }

  if (allPlayerDecks.length <= 3) {
    // if duel is already full add to other
    if (type === "duel" && playerDecks.duel.length >= 3) {
      playerDecks.other.push({ img, cards })
    } else {
      playerDecks[type].push({ img, cards })
    }
  }
}

/**
 * return { duel: [{ img: "", cards: []}], singles: [{ img: "", cards: []}]}
 */
export const getWarDecksFromLog = (log) =>
  new Promise((resolve) => {
    const playerDecks = {
      duel: [],
      other: [], // can contain duel decks if not from most recent duel
    }

    const mostRecentDuel = log.find(
      (m) => m.type === "riverRaceDuel" || m.type === "riverRaceDuelColosseum"
    )

    // set first duel
    if (mostRecentDuel) {
      for (const r of mostRecentDuel.team[0].rounds) {
        playerDecks.duel.push({
          img: "duel",
          cards: r.cards.map((c) => `${c.name}${c.evolutionLevel ? " Evo" : ""}`),
        })
      }
    }

    // set other decks
    let index = 0
    while (playerDecks.duel.length + playerDecks.other.length < 4 && index < log.length) {
      const m = log[index]

      if (m.type === "riverRacePvP") {
        const cards = m.team[0].cards.map((c) =>
          c.evolutionLevel ? `${c.name} Evo` : c.name
        )

        const imgPath =
          m.gameMode.name === "CW_Battle_1v1"
            ? "battle"
            : specialGamemodes.find((gm) => gm.name === m.gameMode.name).img

        addDeck(cards, playerDecks, imgPath)
      } else if (m.type === "riverRaceDuel" || m.type === "riverRaceDuelColosseum") {
        for (const r of m.team[0].rounds) {
          const cards = r.cards.map((c) => `${c.name}${c.evolutionLevel ? " Evo" : ""}`)

          addDeck(cards, playerDecks, "duel", "duel")
        }
      }
      index++
    }

    resolve(playerDecks)
  })
