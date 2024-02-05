/* eslint-disable no-console */
import { getAvgFame, getMaxFame, getMinFame, getProjFame } from "../src/lib/functions/race"
import MockClanData, { measurePerf } from "./clan.mock"
import profile from "./profile"

describe("getMinFame", () => {
  test.each(MockClanData)(
    "Fame: $clan.fame Day: $dayOfWeek isColosseum: $isColosseum",
    ({ clan, dayOfWeek, isColosseum, minFame }) => {
      if (measurePerf) profile(getMinFame, clan, isColosseum, dayOfWeek)

      expect(getMinFame(clan, isColosseum, dayOfWeek)).toBe(minFame)
    },
  )
})

describe("getMaxFame", () => {
  test.each(MockClanData)(
    "Fame: $clan.fame Day: $dayOfWeek isColosseum: $isColosseum",
    ({ clan, dayOfWeek, isColosseum, maxFame }) => {
      if (measurePerf) profile(getMinFame, clan, isColosseum, dayOfWeek)

      expect(getMaxFame(clan, isColosseum, dayOfWeek)).toBe(maxFame)
    },
  )
})

describe("getProjFame", () => {
  test.each(MockClanData)(
    "Fame: $clan.fame Day: $dayOfWeek isColosseum: $isColosseum",
    ({ clan, dayOfWeek, isColosseum, projFame }) => {
      if (measurePerf) profile(getMinFame, clan, isColosseum, dayOfWeek)

      expect(getProjFame(clan, isColosseum, dayOfWeek)).toBe(projFame)
    },
  )
})

describe("getAvgFame", () => {
  test.each(MockClanData)(
    "Fame: $clan.fame Day: $dayOfWeek isColosseum: $isColosseum",
    ({ avgFame, clan, dayOfWeek, isColosseum }) => {
      if (measurePerf) profile(getMinFame, clan, isColosseum, dayOfWeek)

      expect(getAvgFame(clan, isColosseum, dayOfWeek).toFixed(2)).toBe(avgFame.toFixed(2))
    },
  )
})
