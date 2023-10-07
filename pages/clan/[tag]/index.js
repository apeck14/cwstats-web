import Image from "next/image"
import { getServerSession } from "next-auth"
import { NextSeo } from "next-seo"
import styled from "styled-components"

import ClanHeader from "../../../components/Clan/Header"
import SubNav from "../../../components/Clan/SubNav"
import MembersTable from "../../../components/Tables/ClanMembers"
import useWindowSize from "../../../hooks/useWindowSize"
import clientPromise from "../../../lib/mongodb"
import { gray } from "../../../public/static/colors"
import { getLastSeenColor, parseDate, relativeDateStr } from "../../../utils/date-time"
import { getClanBadgeFileName, getCountryKeyById } from "../../../utils/files"
import { formatClanType, formatTag, getCRErrorUrl, handleSCResponse, redirect } from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"
import { authOptions } from "../../api/auth/[...nextauth]"

const Main = styled.div``

const InfoDiv = styled.div`
  margin: 1.5rem 0;
  padding: 0 1rem;

  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`

const Description = styled.p`
  color: ${gray["25"]};

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`

const StatsRow = styled.div`
  display: flex;
  margin-top: 1rem;
`

const StatsItem = styled.div`
  display: flex;
  align-items: center;
  width: 33.3%;
`

const StatsIcon = styled(Image)`
  margin-right: 1rem;

  @media (max-width: 480px) {
    margin-right: 0.5rem;
  }
`

const FlagIcon = styled(StatsIcon)`
  border-radius: 1rem;
`

const StatsInfo = styled.div``

const StatsTitle = styled.p`
  color: ${gray["25"]};

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`

const StatsValue = styled.p`
  color: ${gray["0"]};
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`

export default function ClanHome({ badgeName, clan, members, saved }) {
  const { width } = useWindowSize()

  const locationKey = getCountryKeyById(clan.location?.id)
  const clanType = formatClanType(clan.type)

  const infoIconPx = width <= 480 ? 24 : 30

  return (
    <>
      <NextSeo
        description={clan.description}
        openGraph={{
          description: clan.description,
          images: [
            {
              alt: "Clan Badge",
              url: `/assets/badges/${badgeName}.png`,
            },
          ],
          title: `${clan.name} ${clan.tag} | Home - CWStats`,
        }}
        title={`${clan.name} ${clan.tag} | Home - CWStats`}
      />

      <ClanHeader badgeName={badgeName} clan={clan} saved={saved} />

      <SubNav />

      <Main>
        <InfoDiv>
          <Description>{clan.description}</Description>

          <StatsRow>
            <StatsItem>
              <StatsIcon alt="Trophies" height={infoIconPx} src="/assets/icons/trophy-ribbon.png" width={infoIconPx} />
              <StatsInfo>
                <StatsTitle>Trophies</StatsTitle>
                <StatsValue>{clan.clanScore}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon
                alt="Required Trophies"
                height={infoIconPx}
                src="/assets/icons/trophy.png"
                width={infoIconPx}
              />
              <StatsInfo>
                <StatsTitle>{width <= 480 ? "Req. Trophies" : "Required Trophies"}</StatsTitle>
                <StatsValue>{clan.requiredTrophies}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon alt="Weekly Donations" height={infoIconPx} src="/assets/icons/cards.png" width={infoIconPx} />
              <StatsInfo>
                <StatsTitle>{width <= 480 ? "Donations" : "Weekly Donations"}</StatsTitle>
                <StatsValue>{clan.donationsPerWeek}</StatsValue>
              </StatsInfo>
            </StatsItem>
          </StatsRow>
          <StatsRow>
            <StatsItem>
              <StatsIcon alt="Members" height={infoIconPx * 1.2} src="/assets/icons/social.png" width={infoIconPx} />
              <StatsInfo>
                <StatsTitle>Members</StatsTitle>
                <StatsValue>{clan.members} / 50</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon alt="Type" height={infoIconPx} src="/assets/icons/players.png" width={infoIconPx} />
              <StatsInfo>
                <StatsTitle>Type</StatsTitle>
                <StatsValue>{clanType}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <FlagIcon
                alt="Region"
                height={infoIconPx}
                src={`/assets/flags/${locationKey}.png`}
                unoptimized
                width={infoIconPx}
              />
              <StatsInfo>
                <StatsTitle>Region</StatsTitle>
                <StatsValue>{clan.location.name}</StatsValue>
              </StatsInfo>
            </StatsItem>
          </StatsRow>
        </InfoDiv>

        <MembersTable members={members} />
      </Main>
    </>
  )
}

export async function getServerSideProps({ params, req, res }) {
  const { tag } = params

  try {
    // eslint-disable-next-line global-require
    const { ObjectId } = require("mongodb")

    const promises = [fetchClan(formatTag(tag, false))]

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

    const [clanResp, userResp] = await Promise.all(promises)

    const clan = await handleSCResponse(clanResp)

    let saved = false

    if (userResp) saved = !!(userResp.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

    const members = clan?.memberList?.map((m) => {
      const lastSeenDate = m.lastSeen ? parseDate(m.lastSeen) : ""

      return {
        ...m,
        color: getLastSeenColor(lastSeenDate),
        lastSeenDate: lastSeenDate.getTime(),
        lastSeenStr: relativeDateStr(lastSeenDate, false),
      }
    })

    return {
      props: {
        badgeName,
        clan,
        members: members || [],
        saved,
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
