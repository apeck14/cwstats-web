import * as Realm from "realm-web"

export async function getPlayersFromSearch(q, limit) {
  try {
    const realmApp = new Realm.App({ id: process.env.NEXT_PUBLIC_REALM_APP_ID })
    const realmCredentials = Realm.Credentials.anonymous()
    const realm = await realmApp.logIn(realmCredentials)
    const players = await realm.functions.searchPlayerNames(q, limit)

    return { players: players ?? [] }
  } catch ({ message }) {
    return { error: true, message }
  }
}

export default async function handler(req, res) {
  try {
    const { query } = req
    const { limit, q } = query

    const { error, message, players } = await getPlayersFromSearch(q, limit)

    if (error) throw message

    return res.status(200).json({ players })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: err.message,
    })
  }
}
