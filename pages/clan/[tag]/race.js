import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import ClanHeader from "../../../components/Clan/Header"
import Race from "../../../components/Clan/Race"
import RaceNotFound from "../../../components/Clan/Race/NotFound"
import SubNav from "../../../components/Clan/SubNav"
import RaceLeaderboard from "../../../components/Tables/RaceLeaderboard"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import {
  formatRaceIndex,
  formatTag,
  getBattlesRemaining,
  getBestPlace,
  getCRErrorUrl,
  getDuelsRemaining,
  getMaxFame,
  getMinFame,
  getProjFame,
  getProjPlace,
  getWorstPlace,
  handleSCResponse,
  redirect,
} from "../../../utils/functions"
import { fetchClan, fetchRace } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Main = styled.div``

const StatsDiv = styled.div`
  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${gray["50"]};
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
    font-size: 0.8rem;
  }
`

const StatTitle = styled.p`
  color: ${gray["25"]};
`

const StatValue = styled.p`
  color: ${gray["0"]};
`

const Header = styled.h1`
  color: ${gray["0"]};
  text-align: center;
  margin-top: 1rem;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`

const SubHeader = styled.p`
  color: ${gray["25"]};
  text-align: center;
  font-style: italic;
  margin-bottom: 1rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const IndexDiv = styled.div`
  display: flex;
  column-gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;

  h3:first-child {
    background-color: ${gray["50"]};
  }
`

const IndexText = styled.h3`
  color: ${gray["0"]};
  padding: 0.4rem 1rem;
  border-radius: 0.25rem;
  background-color: ${gray["75"]};

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
`

export default function ClanRace({ badgeName, clan, race, saved }) {
  const isColosseum = race.periodType === "colosseum"
  const dayOfWeek = race.periodIndex % 7

  const raceNotFound = !race.clans || race.clans.length === 0

  const getShownParticipants = () => {
    if (!clan.memberTags || !race.clan.participants) return []

    return race.clan.participants
      .filter((p) => clan.memberTags.find((t) => t === p.tag) || p.fame > 0)
      .sort((a, b) => {
        if (a.fame === b.fame) return a.name.localeCompare(b.name)

        return b.fame - a.fame
      })
      .map((p, index) => ({
        ...p,
        inClan: !!clan.memberTags.find((t) => t === p.tag),
        rank: index + 1,
      }))
  }

  return (
    <>
      <NextSeo
        description="View current river race stats and projections."
        openGraph={{
          description: "View current river race stats and projections.",
          images: [
            {
              alt: "Clan Badge",
              url: `/assets/badges/${getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)}.png`,
            },
          ],
          title: `${clan.name} ${clan.tag} | Race - CWStats`,
        }}
        title={`${clan.name} ${clan.tag} | Race - CWStats`}
      />

      <ClanHeader badgeName={badgeName} clan={clan} saved={saved} />

      <SubNav />

      <Main>
        {raceNotFound ? (
          <RaceNotFound />
        ) : (
          <>
            <IndexDiv>
              <IndexText>{isColosseum ? "Colosseum" : `Week ${race.sectionIndex + 1}`}</IndexText>
              <IndexText>{formatRaceIndex(race.periodType, race.periodIndex)}</IndexText>
            </IndexDiv>

            <Race dayOfWeek={dayOfWeek} isColosseum={isColosseum} race={race} />

            <StatsDiv>
              <Header>Stats & Projections</Header>
              <SubHeader>All projections assume 100% participation.</SubHeader>
              <Stat>
                <StatTitle>Total Battles Remaining</StatTitle>
                <StatValue>{getBattlesRemaining(race.clan.participants)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Duels Remaining</StatTitle>
                <StatValue>{getDuelsRemaining(race.clan.participants)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Projected Medals</StatTitle>
                <StatValue>{getProjFame(race.clan, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Maximum Possible Medals</StatTitle>
                <StatValue>{getMaxFame(race.clan, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Minimum Possible Medals</StatTitle>
                <StatValue>{getMinFame(race.clan, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Projected Place</StatTitle>
                <StatValue>{getProjPlace(race, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Best Possible Place</StatTitle>
                <StatValue>{getBestPlace(race, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
              <Stat>
                <StatTitle>Worst Possible Place</StatTitle>
                <StatValue>{getWorstPlace(race, isColosseum, dayOfWeek)}</StatValue>
              </Stat>
            </StatsDiv>

            <Header>Participants</Header>

            <RaceLeaderboard participants={getShownParticipants()} />
          </>
        )}
      </Main>
    </>
  )
}

export async function getServerSideProps({ params, req, res }) {
  const { tag } = params
  const formattedTag = formatTag(tag, false)

  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const promises = [fetchClan(formattedTag), fetchRace(formattedTag)]

    const session = await getServerSession(req, res, authOptions)

    if (session) {
      const client = await clientPromise
      const db = client.db("General")
      const accounts = db.collection("accounts")
      const linkedAccounts = db.collection("Linked Accounts")

      const userId = new ObjectId(session.user.id)

      const user = await accounts.findOne({
        userId,
      })

      promises.push(
        linkedAccounts.findOne({
          discordID: user.providerAccountId,
        }),
      )
    }

    const [clanResp, raceResp, userResp] = await Promise.all(promises)

    let clan = {}
    let race = []

    // not in an active race
    if (raceResp.status === 404) {
      clan = await handleSCResponse(clanResp)
    } else {
      const [clanData, raceData] = await Promise.all([handleSCResponse(clanResp), handleSCResponse(raceResp)])

      if (raceData.state === "matchmaking") {
        return redirect("/matchmaking")
      }

      clan = clanData
      race = raceData
    }

    let saved

    if (userResp) saved = (userResp?.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

    const memberTags = clan?.memberList?.map((p) => p.tag) || []

    return {
      props: {
        badgeName,
        clan: {
          clanScore: clan.clanScore,
          clanWarTrophies: clan.clanWarTrophies,
          memberTags,
          name: clan.name,
          tag: clan.tag,
        },
        race: {
          clan: race.clan,
          clans: race.clans,
          periodIndex: race.periodIndex,
          periodType: race.periodType,
          sectionIndex: race.sectionIndex,
        },
        saved: !!saved, // not sure :)
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
