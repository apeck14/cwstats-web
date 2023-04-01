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

//conver all O's to 0, remove all non-alphanumeric
export const formatTag = (tag, withHashtag = false) => {
	let newTag = tag.replace(/[^A-Za-z0-9]/g, "").replace(/O/g, "0")

	if (withHashtag) return "#" + newTag

	return newTag
}

export const battleDaysCompleted = (isColosseum, dayOfWeek) => {
	if (!isColosseum || dayOfWeek <= 3) return 0
	else return dayOfWeek - 3
}

export const getAvgFame = (clan, isColosseum, dayOfWeek) => {
	const attacksCompletedToday = clan.participants.reduce((a, b) => a + b.decksUsedToday, 0)
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

export const getProjFame = (clan, isColosseum, dayOfWeek) => {
	if (!clan) return "N/A"

	const movementPoints = isColosseum ? clan.periodPoints : clan.fame
	const fame = isColosseum ? clan.fame : clan.periodPoints
	const multiple = fame % 10 === 0 ? 50 : 25

	if (!isColosseum && movementPoints >= 10000) return 0

	const maxDuelsCompletedToday = clan.participants.filter((p) => p.decksUsedToday >= 2).length
	const attacksCompletedToday = clan.participants.reduce((a, b) => a + b.decksUsedToday, 0)
	const isTraining = dayOfWeek <= 3
	const battleDaysCompleted = !isColosseum || isTraining ? 0 : dayOfWeek - 3

	const totalPossibleFame = () => {
		const movementPoints = isColosseum ? clan.periodPoints : clan.fame
		const fame = isColosseum ? clan.fame : clan.periodPoints

		if (!isColosseum && movementPoints >= 10000) return 0

		const duelsRemainingToday = 50 - maxDuelsCompletedToday
		const totalAttacksRemaining = 200 - attacksCompletedToday
		let maxPossibleFame = fame + duelsRemainingToday * 500 + (totalAttacksRemaining - duelsRemainingToday * 2) * 200 //max fame today

		if (isColosseum) {
			maxPossibleFame += 45000 * (3 - battleDaysCompleted)

			return maxPossibleFame > 180000 ? 180000 : maxPossibleFame
		}

		return maxPossibleFame > 45000 ? 45000 : maxPossibleFame
	}

	let currentPossibleFame = maxDuelsCompletedToday * 500 + (attacksCompletedToday - maxDuelsCompletedToday * 2) * 200
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
		crossedFinishLine: c[boatAccessor] >= 10000
	}))

	const clansWithPointsSorted = newRace.filter((cl) => cl.fame > 0).sort((a, b) => b.fame - a.fame)

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

export const getBattlesRemaining = (participants) => {
	return 200 - participants.reduce((a, b) => a + b.decksUsedToday, 0)
}

export const getDuelsRemaining = (participants) => {
	return 50 - participants.filter((p) => p.decksUsedToday >= 2).length
}

export const getMaxFame = (clan, isColosseum, dayOfWeek) => {
	if (!clan) return "N/A"

	const movementPoints = isColosseum ? clan.periodPoints : clan.fame
	const fame = isColosseum ? clan.fame : clan.periodPoints

	if (!isColosseum && movementPoints >= 10000) return 0

	const duelsRemainingToday = 50 - clan.participants.filter((p) => p.decksUsedToday >= 2).length
	const totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0) //today
	let maxPossibleFame = fame + duelsRemainingToday * 500 + (totalAttacksRemaining - duelsRemainingToday * 2) * 200 //max fame today

	if (isColosseum) {
		const battleDaysComp = battleDaysCompleted(isColosseum, dayOfWeek)
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

	let totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0)

	if (isColosseum) totalAttacksRemaining += 200 * (3 - battleDaysCompleted(isColosseum, dayOfWeek))

	return fame + totalAttacksRemaining * 100
}

export const getProjPlace = (race, isColosseum, dayOfWeek) => {
	if (!race || !race.clans) return "N/A"

	const clanProjections = race.clans.map((c) => ({
		tag: c.tag,
		fame: getProjFame(c, isColosseum, dayOfWeek),
	}))

	const projPlacements = getCurrentPlacements(clanProjections)

	const placement = projPlacements.find((c) => c.tag === race.clan.tag).placement

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
		else {
			return {
				tag: c.tag,
				fame: getMinFame(c, isColosseum, dayOfWeek),
			}
		}
	})

	const projPlacements = getCurrentPlacements(clanProjections)

	const placement = projPlacements.find((c) => c.tag === race.clan.tag).placement

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
		else {
			return {
				tag: c.tag,
				fame: getMaxFame(c, isColosseum, dayOfWeek),
			}
		}
	})

	const projPlacements = getCurrentPlacements(clanProjections)

	const placement = projPlacements.find((c) => c.tag === race.clan.tag).placement

	return placementStr(placement)
}

export const getCurrentPlacements = (race) => {
	const newRace = [...race]

	newRace
		.filter((c) => c.fame === 0)
		.forEach((c) => {
			newRace.find((cl) => c.tag === cl.tag).placement = Infinity
		})

	const clansWithPointsSorted = newRace.filter((cl) => cl.fame > 0).sort((a, b) => b.fame - a.fame)
	let place = 1

	for (let i = 0; i < clansWithPointsSorted.length; i++) {
		const clansWithSameFame = [clansWithPointsSorted[i].tag]

		for (let x = i + 1; x < clansWithPointsSorted.length; x++)
			if (clansWithPointsSorted[x].fame === clansWithPointsSorted[i].fame) clansWithSameFame.push(clansWithPointsSorted[x].tag)

		for (const c of clansWithSameFame)
			newRace.find((cl) => c === cl.tag).placement = place

		i += clansWithSameFame.length - 1
		place += clansWithSameFame.length
	}

	return newRace
}

export const placementStr = (placement) => {
	if (placement === 1) return "1st"
	else if (placement === 2) return "2nd"
	else if (placement === 3) return "3rd"
	else if (placement === 4) return "4th"
	else if (placement === 5) return "5th"
	else return "N/A"
}

const supportedCodes = [
	404, //not found
	429, //rate limit
	503 //maintenence break
]

export const handleCRError = (err, router) => {
	const { status } = err

	if (supportedCodes.includes(status))
		router.push(`/${status}`)
	else if (status)
		router.push('/500')

	return null
}

export const getCRErrorUrl = (err) => {
	const { status } = err

	if (supportedCodes.includes(status))
		return `/${status}`
	else if (status)
		return '/500'

	return "/"
}

export const handleSCResponse = async (res) => {
	const data = await res.json()

	if (res.ok) return data
	else {
		throw {
			status: res.status,
			message: res.statusText
		}
	}
}