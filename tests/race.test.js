const { getMinFame } = require("../src/lib/functions/race")
const MockClanData = require("./clan.mock")

describe("getMinFame", () => {
  test.each(MockClanData)("Day: $dayOfWeek isColosseum: $isColosseum,", ({ clan, dayOfWeek, isColosseum, minFame }) => {
    expect(getMinFame(clan, isColosseum, dayOfWeek)).toBe(minFame)
  })
})
