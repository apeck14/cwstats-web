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
import {
  formatClanType,
  formatTag,
  getCRErrorUrl,
  handleSCResponse,
  redirect,
} from "../../../utils/functions"
import { fetchClan } from "../../../utils/services"
import { addClan } from "../../api/add/clan"
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

export default function ClanHome({ clan, members, badgeName, saved }) {
  const { width } = useWindowSize()

  const locationKey = getCountryKeyById(clan.location?.id)
  const clanType = formatClanType(clan.type)

  const infoIconPx = width <= 480 ? 24 : 30

  return (
    <>
      <NextSeo
        title={`${clan.name} | Home - CWStats`}
        description={clan.description}
        openGraph={{
          title: `${clan.name} | Home - CWStats`,
          description: clan.description,
          images: [
            {
              url: `/assets/badges/${badgeName}.png`,
              alt: "Clan Badge",
            },
          ],
        }}
      />

      <ClanHeader clan={clan} badgeName={badgeName} saved={saved} />

      <SubNav />

      <Main>
        <InfoDiv>
          <Description>{clan.description}</Description>

          <StatsRow>
            <StatsItem>
              <StatsIcon
                src="/assets/icons/trophy-ribbon.png"
                height={infoIconPx}
                width={infoIconPx}
                alt="Trophies"
              />
              <StatsInfo>
                <StatsTitle>Trophies</StatsTitle>
                <StatsValue>{clan.clanScore}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon
                src="/assets/icons/trophy.png"
                height={infoIconPx}
                width={infoIconPx}
                alt="Required Trophies"
              />
              <StatsInfo>
                <StatsTitle>
                  {width <= 480 ? "Req. Trophies" : "Required Trophies"}
                </StatsTitle>
                <StatsValue>{clan.requiredTrophies}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon
                src="/assets/icons/cards.png"
                height={infoIconPx}
                width={infoIconPx}
                alt="Weekly Donations"
              />
              <StatsInfo>
                <StatsTitle>{width <= 480 ? "Donations" : "Weekly Donations"}</StatsTitle>
                <StatsValue>{clan.donationsPerWeek}</StatsValue>
              </StatsInfo>
            </StatsItem>
          </StatsRow>
          <StatsRow>
            <StatsItem>
              <StatsIcon
                src="/assets/icons/social.png"
                height={infoIconPx * 1.2}
                width={infoIconPx}
                alt="Members"
              />
              <StatsInfo>
                <StatsTitle>Members</StatsTitle>
                <StatsValue>{clan.members} / 50</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <StatsIcon
                src="/assets/icons/players.png"
                height={infoIconPx}
                width={infoIconPx}
                alt="Type"
              />
              <StatsInfo>
                <StatsTitle>Type</StatsTitle>
                <StatsValue>{clanType}</StatsValue>
              </StatsInfo>
            </StatsItem>
            <StatsItem>
              <FlagIcon
                src={`/assets/flags/${locationKey}.png`}
                height={infoIconPx}
                width={infoIconPx}
                alt="Region"
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

export async function getServerSideProps({ req, res, params }) {
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
        })
      )
    }

    const [clanResp, userResp] = await Promise.all(promises)

    const clan = await handleSCResponse(clanResp)

    let saved = false

    if (userResp) saved = !!(userResp.savedClans || []).find((c) => c.tag === clan.tag)

    const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)
    addClan({ name: clan.name, tag: clan.tag, badge: badgeName })

    const members = clan?.memberList?.map((m) => {
      const lastSeenDate = m.lastSeen ? parseDate(m.lastSeen) : ""

      return {
        ...m,
        lastSeenStr: relativeDateStr(lastSeenDate, false),
        color: getLastSeenColor(lastSeenDate),
        lastSeenDate: lastSeenDate.getTime(),
      }
    })

    return {
      props: {
        clan,
        members: members || [],
        saved,
        badgeName,
      },
    }
  } catch (err) {
    return redirect(getCRErrorUrl(err))
  }
}
