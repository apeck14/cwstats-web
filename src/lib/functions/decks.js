 
import specialGamemodes from "@/static/special-gamemodes"

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
      playerDecks.other.push({ cards, img })
    } else {
      playerDecks[type].push({ cards, img })
    }
  }
}

export const getWarDecksFromLog = (log) =>
  new Promise((resolve) => {
    const playerDecks = {
      duel: [],
      other: [], // can contain duel decks if not from most recent duel
    }

    const mostRecentDuel = log.find((m) => m.type === "riverRaceDuel" || m.type === "riverRaceDuelColosseum")

    if (mostRecentDuel) {
      for (const r of mostRecentDuel.team[0].rounds) {
        playerDecks.duel.push({
          cards: r.cards.map((c) => `${c.name}${c.evolutionLevel ? " Evo" : ""}`),
          img: "duel",
        })
      }
    }

    let index = 0
    while (playerDecks.duel.length + playerDecks.other.length < 4 && index < log.length) {
      const m = log[index]

      if (m.type === "riverRacePvP") {
        const cards = m.team[0].cards.map((c) => (c.evolutionLevel ? `${c.name} Evo` : c.name))

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
