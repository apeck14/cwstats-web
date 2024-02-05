export const formatPlacement = (place) => {
  if (place === 1) return "1st"
  if (place === 2) return "2nd"
  if (place === 3) return "3rd"
  if (place === 4) return "4th"
  if (place === 5) return "5th"
  return "N/A"
}

export const getRaceIndexDescriptions = (periodLogs, tag, isColosseum) => {
  // return { mobile: ["+3000", ...], standard: ["1st (+3450)", ...]}
  const mobile = []
  const standard = []

  if (isColosseum) return { mobile, standard }

  for (let i = 0; i < periodLogs.length; i++) {
    const period = periodLogs[i]
    const clan = period.items.find((c) => c.clan.tag === tag)
    const totalProgress = clan.progressEarned + clan.progressEarnedFromDefenses

    mobile.push(`+${totalProgress}`)
    standard.push(`${formatPlacement(clan.endOfDayRank + 1)} (+${totalProgress})`)
  }

  return { mobile, standard }
}

export const getAvgFame = (clan, isColosseum, dayOfWeek) => {
  const attacksCompletedToday = clan.participants.reduce((sum, p) => sum + p.decksUsedToday, 0)

  if (isColosseum && dayOfWeek === 3 && attacksCompletedToday === 0) return 0
  if ((!isColosseum && (clan.fame >= 10000 || attacksCompletedToday === 0)) || dayOfWeek < 3) return 0

  const totalAttacksUsed = isColosseum ? attacksCompletedToday + 200 * (dayOfWeek - 3) : attacksCompletedToday

  return (isColosseum ? clan.fame : clan.periodPoints) / totalAttacksUsed
}

const getPossibleRemainingFame = (attacksCompletedToday, maxDuelsCompletedToday, isColosseum, dayOfWeek) => {
  const duelsRemainingToday = 50 - maxDuelsCompletedToday
  const totalAttacksRemaining = 200 - attacksCompletedToday
  let maxPossibleRemainingFame = duelsRemainingToday * 500 + (totalAttacksRemaining - duelsRemainingToday * 2) * 200

  if (isColosseum) {
    maxPossibleRemainingFame += 45000 * (6 - dayOfWeek)
  }

  return isColosseum ? Math.min(180000, maxPossibleRemainingFame) : Math.min(45000, maxPossibleRemainingFame)
}

export const getProjFame = (clan, isColosseum, dayOfWeek) => {
  if ((!isColosseum && clan.fame >= 10000) || dayOfWeek < 3 || !clan.participants.length) return 0

  let attacksCompletedToday = 0
  let maxDuelsCompletedToday = 0

  for (const p of clan.participants) {
    attacksCompletedToday += p.decksUsedToday
    if (p.decksUsedToday >= 2) maxDuelsCompletedToday++
  }

  if ((!isColosseum && attacksCompletedToday === 0) || (isColosseum && dayOfWeek === 3 && attacksCompletedToday === 0))
    return 0

  const fame = isColosseum ? clan.fame : clan.periodPoints
  const multiple = fame % 10 === 0 ? 50 : 25

  let currentPossibleFame = maxDuelsCompletedToday * 500 + (attacksCompletedToday - maxDuelsCompletedToday * 2) * 200

  if (isColosseum) {
    currentPossibleFame += 45000 * (dayOfWeek - 3)
  }

  const winRate = fame / currentPossibleFame
  const possibleRemainingFame = getPossibleRemainingFame(
    attacksCompletedToday,
    maxDuelsCompletedToday,
    isColosseum,
    dayOfWeek,
  )

  const projectedFame = fame + possibleRemainingFame * winRate

  return Math.min(isColosseum ? 180000 : 45000, Math.ceil(projectedFame / multiple) * multiple)
}

export const getMaxFame = (clan, isColosseum, dayOfWeek) => {
  if ((!isColosseum && clan.fame >= 10000) || dayOfWeek < 3 || !clan.participants.length) return 0

  let attacksCompletedToday = 0
  let maxDuelsCompletedToday = 0

  for (const p of clan.participants) {
    attacksCompletedToday += p.decksUsedToday
    if (p.decksUsedToday >= 2) maxDuelsCompletedToday++
  }

  const duelsRemainingToday = 50 - maxDuelsCompletedToday
  const totalAttacksRemaining = 200 - attacksCompletedToday
  const fame = isColosseum ? clan.fame : clan.periodPoints
  let maxPossibleFame = fame + duelsRemainingToday * 500 + (totalAttacksRemaining - duelsRemainingToday * 2) * 200

  if (isColosseum) {
    maxPossibleFame += 45000 * (6 - dayOfWeek)
    return Math.min(180000, maxPossibleFame)
  }

  return Math.min(45000, maxPossibleFame)
}

export const getMinFame = (clan, isColosseum, dayOfWeek) => {
  if ((!isColosseum && clan.fame >= 10000) || dayOfWeek < 3 || !clan.participants.length) return 0

  let totalAttacksRemaining = 200 - clan.participants.reduce((sum, p) => sum + p.decksUsedToday, 0)

  if (isColosseum) totalAttacksRemaining += 200 * (6 - dayOfWeek)

  const fame = isColosseum ? clan.fame : clan.periodPoints

  return fame + totalAttacksRemaining * 100
}

export const getCurrentPlacements = (race) => {
  const sortedClans = race.sort((a, b) => b.fame - a.fame)

  let place = 1

  for (let i = 0; i < sortedClans.length; ) {
    const currentFame = sortedClans[i].fame

    if (currentFame === 0) break

    let sameFameCount = 0
    for (let j = i; j < sortedClans.length && sortedClans[j].fame === currentFame; j++) {
      sortedClans[j].placement = place
      sameFameCount++
    }

    i += sameFameCount
    place += sameFameCount
  }

  return sortedClans
}

export const getProjPlace = (race, isColosseum, dayOfWeek) => {
  const movementPtsAccessor = isColosseum ? "periodPoints" : "fame"

  if (!race || !race.clans || dayOfWeek < 3 || race.clan[movementPtsAccessor] >= 10000) return "N/A"

  const clanProjections = race.clans.map((c) => ({
    fame: getProjFame(c, isColosseum, dayOfWeek),
    tag: c.tag,
  }))

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return formatPlacement(placement)
}

export const getBestPlace = (race, isColosseum, dayOfWeek) => {
  const movementPtsAccessor = isColosseum ? "periodPoints" : "fame"

  if (!race || !race.clans || dayOfWeek < 3 || race.clan[movementPtsAccessor] >= 10000) return "N/A"

  const clanProjections = race.clans.map((c) => ({
    fame: c.tag === race.clan.tag ? getMaxFame(c, isColosseum, dayOfWeek) : getMinFame(c, isColosseum, dayOfWeek),
    tag: c.tag,
  }))

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return formatPlacement(placement)
}

export const getWorstPlace = (race, isColosseum, dayOfWeek) => {
  const movementPtsAccessor = isColosseum ? "periodPoints" : "fame"

  if (!race || !race.clans || dayOfWeek < 3 || race.clan[movementPtsAccessor] >= 10000) return "N/A"

  const clanProjections = race.clans.map((c) => ({
    fame: c.tag === race.clan.tag ? getMinFame(c, isColosseum, dayOfWeek) : getMaxFame(c, isColosseum, dayOfWeek),
    tag: c.tag,
  }))

  const projPlacements = getCurrentPlacements(clanProjections)

  const { placement } = projPlacements.find((c) => c.tag === race.clan.tag)

  return formatPlacement(placement)
}

export const getRaceDetails = (race) => {
  if (!race || !race?.clans || !race.clans.length) return { clans: [] }

  const isColosseum = race.periodType === "colosseum"

  const dayOfWeek = race.periodIndex % 7
  const { boatAccessor, fameAccessor } = isColosseum
    ? { boatAccessor: "periodPoints", fameAccessor: "fame" }
    : { boatAccessor: "fame", fameAccessor: "periodPoints" }

  const mappedClans = race.clans.map((clan) => {
    const shared = {
      badgeId: clan.badgeId,
      boatPoints: clan[boatAccessor],
      crossedFinishLine: clan[boatAccessor] >= 10000,
      fame: clan[fameAccessor],
      fameAvg: getAvgFame(clan, isColosseum, dayOfWeek),
      name: clan.name,
      projFame: getProjFame(clan, isColosseum, dayOfWeek),
      tag: clan.tag,
      trophies: clan.clanScore,
    }

    if (clan.tag === race.clan.tag) {
      const battleDaysCompleted = dayOfWeek - 3
      const thisWeeksLogs = race.periodLogs?.length
        ? race.periodLogs.splice(race.periodLogs.length - battleDaysCompleted)
        : []

      return {
        ...shared,
        battlesRemaining: 200 - clan.participants.reduce((sum, p) => sum + p.decksUsedToday, 0),
        bestPlace: getBestPlace(race, isColosseum, dayOfWeek),
        duelsRemaining: 50 - clan.participants.filter((p) => p.decksUsedToday >= 2).length,
        maxFame: getMaxFame(clan, isColosseum, dayOfWeek),
        minFame: getMinFame(clan, isColosseum, dayOfWeek),
        participants: clan.participants || [],
        periodLogDescriptions: getRaceIndexDescriptions(thisWeeksLogs, clan.tag, isColosseum),
        projPlace: getProjPlace(race, isColosseum, dayOfWeek),
        worstPlace: getWorstPlace(race, isColosseum, dayOfWeek),
      }
    }

    return shared
  })

  const clans = getCurrentPlacements(mappedClans)

  clans.sort((a, b) => b.crossedFinishLine - a.crossedFinishLine || a.placement - b.placement)

  return {
    clans,
    periodIndex: race.periodIndex,
    periodType: race.periodType,
    sectionIndex: race.sectionIndex,
  }
}
