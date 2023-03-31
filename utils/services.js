import { formatTag, handleSCResponse } from "./functions"

export const savePlayer = (name, tag) =>
	fetch(`/api/user/player`, {
		method: 'PUT',
		body: JSON.stringify({
			name,
			tag
		}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const unsavePlayer = (tag) =>
	fetch(`/api/user/player`, {
		method: 'DELETE',
		body: JSON.stringify({
			tag
		}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const saveClan = (name, tag, badge) =>
	fetch(`/api/user/clan`, {
		method: 'PUT',
		body: JSON.stringify({
			name,
			tag,
			badge
		}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const unsaveClan = (tag) =>
	fetch(`/api/user/clan`, {
		method: 'DELETE',
		body: JSON.stringify({
			tag
		}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const getUser = () =>
	fetch('/api/user')
		.then(res => res.json())

export const getDailyLeaderboard = ({ id, limit, minTrophies, maxTrophies }) =>
	fetch(`/api/leaderboard/daily/${id}?limit=${limit || ''}&minTrophies=${minTrophies || ''}&maxTrophies=${maxTrophies || ''}`, {
		method: 'GET',
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const getWarLeaderboard = (id) =>
	fetch(`https://proxy.royaleapi.dev/v1/locations/${id}/rankings/clanwars`, {
		method: "GET",
		headers: new Headers({
			'Content-Type': 'application/json',
			'Authorization': "Bearer " + process.env.NEXT_PUBLIC_CR_API_TOKEN
		})
	})

export const getClan = (tag) => fetch(`/api/clan/${formatTag(tag, false)}`).then(handleSCResponse)

export const getRace = (tag) => fetch(`/api/clan/${formatTag(tag, false)}/race`).then(handleSCResponse)

export const addClan = (name, tag, badge) =>
	fetch(`/api/add/clan`, {
		method: 'PUT',
		body: JSON.stringify({
			name,
			tag,
			badge
		}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})

export const getClanSearchResults = (query) =>
	fetch(`/api/search/clan?q=${encodeURIComponent(query)}`, {
		method: "GET",
		headers: new Headers({
			'Content-Type': 'application/json',
		})
	})
		.then(res => res.json())