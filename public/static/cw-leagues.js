/* eslint-disable perfectionist/sort-objects */
module.exports = [
  {
    league: "bronze",
    minTrophies: 0,
    maxTrophies: 599,
    netTrophyChanges: 30,
    netColTrophyChanges: 150,
    trophyChanges: [20, 10, 0, 0, 0],
    colTrophyChanges: [100, 50, 0, 0, 0],
  },
  {
    league: "silver",
    minTrophies: 600,
    maxTrophies: 1499,
    netTrophyChanges: 2,
    netColTrophyChanges: 10,
    trophyChanges: [20, 10, -4, -8, -16],
    colTrophyChanges: [100, 50, -20, -40, -80],
  },
  {
    league: "gold",
    minTrophies: 1500,
    maxTrophies: 2999,
    netTrophyChanges: -5,
    netColTrophyChanges: -25,
    trophyChanges: [20, 10, -5, -10, -20],
    colTrophyChanges: [100, 50, -25, -50, -100],
  },
  {
    league: "legendary",
    minTrophies: 3000,
    netTrophyChanges: -5,
    netColTrophyChanges: -25,
    trophyChanges: [20, 10, -5, -10, -20],
    colTrophyChanges: [100, 50, -25, -50, -100],
  },
]
