import { formatTag, handleSCResponse } from "./functions"

export const savePlayer = (name, tag) =>
  fetch(`/api/user/player`, {
    body: JSON.stringify({
      name,
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const unsavePlayer = (tag) =>
  fetch(`/api/user/player`, {
    body: JSON.stringify({
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "DELETE",
  })

export const saveClan = (name, tag, badge) =>
  fetch(`/api/user/clan`, {
    body: JSON.stringify({
      badge,
      name,
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const unsaveClan = (tag) =>
  fetch(`/api/user/clan`, {
    body: JSON.stringify({
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const getUser = () => fetch("/api/user").then((res) => res.json())

export const getDailyLeaderboard = ({ id, limit, maxTrophies, minTrophies }) =>
  fetch(
    `/api/leaderboard/daily/${id}?limit=${limit || ""}&minTrophies=${minTrophies || ""}&maxTrophies=${
      maxTrophies || ""
    }`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: "GET",
    },
  )

export const getWarLeaderboard = (id) =>
  fetch(`https://proxy.royaleapi.dev/v1/locations/${id}/rankings/clanwars`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const fetchClan = (tag) =>
  fetch(`https://proxy.royaleapi.dev/v1/clans/%23${tag}`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const fetchPlayer = (tag) =>
  fetch(`https://proxy.royaleapi.dev/v1/players/%23${tag}`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const fetchRace = (tag) =>
  fetch(`https://proxy.royaleapi.dev/v1/clans/%23${tag}/currentriverrace`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const fetchLog = (tag) =>
  fetch(`https://proxy.royaleapi.dev/v1/clans/%23${tag}/riverracelog`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const fetchGuilds = (accessToken) =>
  fetch("https://discordapp.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

export const fetchGuildChannels = (serverId) =>
  fetch(`https://discordapp.com/api/guilds/${serverId}/channels`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
    },
  })

export const getClan = (tag) => fetch(`/api/clan/${formatTag(tag, false)}`).then(handleSCResponse)

export const getPlayer = (tag) => fetch(`/api/player/${formatTag(tag, false)}`).then(handleSCResponse)

export const getBattleLog = (tag) => fetch(`/api/player/${formatTag(tag, false)}/battlelog`).then(handleSCResponse)

export const getRace = (tag) => fetch(`/api/clan/${formatTag(tag, false)}/race`).then(handleSCResponse)

export const addPlayer = (name, tag, clanName) =>
  fetch(`/api/add/player`, {
    body: JSON.stringify({
      clanName,
      name,
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const addAbbreviation = (serverId, abbr, clanTag) =>
  fetch(`/api/guild/abbreviation`, {
    body: JSON.stringify({
      abbr,
      clanTag,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const removeAbbreviation = (serverId, abbr) =>
  fetch(`/api/guild/abbreviation/${encodeURIComponent(serverId)}/${encodeURIComponent(abbr)}`, {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "DELETE",
  })

export const setDefaultClan = (clanTag, serverId) =>
  fetch(`/api/guild/clan`, {
    body: JSON.stringify({
      clanTag,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const removeDefaultClan = (serverId) =>
  fetch(`/api/guild/clan/${encodeURIComponent(serverId)}`, {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "DELETE",
  })

export const setGuildChannels = (channels, serverId) =>
  fetch(`/api/guild/channels`, {
    body: JSON.stringify({
      channels,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const addScheduledNudge = ({ channelID, clanTag, scheduledHourUTC, serverId }) =>
  fetch(`/api/nudges/scheduled`, {
    body: JSON.stringify({
      channelID,
      clanTag,
      scheduledHourUTC,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const removeScheduledNudge = ({ clanTag, scheduledHourUTC, serverId }) =>
  fetch(`/api/nudges/scheduled`, {
    body: JSON.stringify({
      clanTag,
      scheduledHourUTC,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const updateNudgeSettings = ({ ignoreLeaders, message, serverId }) =>
  fetch(`/api/nudges/settings`, {
    body: JSON.stringify({
      ignoreLeaders,
      message,
      serverId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const searchGuildMembers = ({ query, serverId }) =>
  fetch(`/api/discord/search?serverId=${serverId}&&query=${encodeURIComponent(query)}`, {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "GET",
  })

export const addLinkedAccount = ({ discordID, serverId, tag }) =>
  fetch(`/api/nudges/linkedAccount`, {
    body: JSON.stringify({
      discordID,
      serverId,
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "PUT",
  })

export const removeLinkedAccount = ({ discordID, serverId, tag }) =>
  fetch(`/api/nudges/linkedAccount`, {
    body: JSON.stringify({
      discordID,
      serverId,
      tag,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
  })

export const getPlayersFromSearch = (q, limit = 50) =>
  fetch(`/api/search/player?q=${encodeURIComponent(q)}&limit=${limit}`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      "Content-Type": "application/json",
    }),
    method: "GET",
  })
