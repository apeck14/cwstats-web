import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import { parseDate } from "../../../utils/date-time"
import { getClanBadgeFileName } from "../../../utils/files"
import ClanLogsParticipants from "../../Tables/ClanLogsParticipants"

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0;
  scroll-margin-top: 4rem; //navbar height
`

const ContentHeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgb(255, 165, 0);
  background: linear-gradient(90deg, rgba(255, 165, 0, 1) 10%, rgba(255, 35, 122, 1) 90%);
  color: ${gray["0"]};
  align-items: center;

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`

const HeaderText = styled.p``

const Date = styled.p`
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const ClansDiv = styled.div``

const ClanItem = styled.div`
  padding: 1rem;
  background-color: ${(props) => (props.isClan ? gray["50"] : gray["75"])};
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${gray["100"]};
  display: flex;

  :hover,
  :active {
    cursor: ${(props) => (props.isClan ? null : "pointer")};
    background-color: ${(props) => (props.isClan ? null : gray["100"])};
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
`

const ClanItemText = styled.p`
  flex: ${(props) => props.flex};
  justify-content: ${(props) => (props.alignRight ? "right" : null)};
  color: ${gray["0"]};
  display: inline-flex;
  align-items: center;
`

const ClanBadge = styled(Image)`
  margin-right: 0.5rem;
`

const ClanIcon = styled(Image)`
  margin-left: 0.25rem;
`

const TrophyChange = styled.span`
  color: ${gray["25"]};
  font-size: 0.9rem;
  margin-right: 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`

const ShowParticipantsBtn = styled.button`
  background-color: ${pink};
  border-radius: 0.25rem;
  color: ${gray["0"]};
  font-weight: 600;
  width: 10rem;
  height: 2rem;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    height: 1.75rem;
    width: 8rem;
  }

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }
`

export default function ClanLogItem({ clan, week }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const [showParticipants, setShowParticipants] = useState(false)

  const handleClick = () => setShowParticipants(true)

  const isMobile = width <= 480
  const clanBadgeHeight = isMobile ? 22 : 26
  const clanBadgeWidth = isMobile ? 16 : 20

  const iconPx = isMobile ? 16 : 18
  return (
    <ContentDiv key={`${week.seasonId}${week.sectionIndex}`} id={`${week.seasonId}-${week.sectionIndex}`}>
      <ContentHeaderDiv>
        <HeaderText>
          Season {week.seasonId} - Week {week.sectionIndex + 1}
        </HeaderText>
        <Date>{parseDate(week.createdDate).toUTCString()}</Date>
      </ContentHeaderDiv>

      <ClansDiv>
        {week.standings.map((c) => {
          const isClan = clan.clan.tag === c.clan.tag
          const changeVal = `${c.trophyChange > 0 ? "+" : ""}${c.trophyChange}`

          return (
            <ClanItem
              isClan={isClan}
              key={c.clan.tag}
              onClick={() => (isClan ? null : router.push(`/clan/${c.clan.tag.substring(1)}/log`))}
            >
              <ClanItemText flex={isMobile ? 0.15 : 0.25}>{c.rank}</ClanItemText>
              <ClanItemText flex={isMobile ? 0.85 : 0.75}>
                <ClanBadge
                  src={`/assets/badges/${getClanBadgeFileName(c.clan.badgeId, c.clan.clanScore)}.png`}
                  height={clanBadgeHeight}
                  width={clanBadgeWidth}
                  unoptimized
                />
                {c.clan.name}
              </ClanItemText>
              <ClanItemText flex={0.5} alignRight>
                {c.clan.fame}
                <ClanIcon src="/assets/icons/boat-movement.png" height={iconPx} width={isMobile ? 19 : 21} />
              </ClanItemText>
              <ClanItemText flex={0.5} alignRight>
                <TrophyChange>{changeVal}</TrophyChange>
                {c.clan.clanScore}
                <ClanIcon src="/assets/icons/cw-trophy.png" height={iconPx} width={iconPx} />
              </ClanItemText>
            </ClanItem>
          )
        })}
      </ClansDiv>

      {showParticipants ? (
        <ClanLogsParticipants participants={clan.clan.participants} />
      ) : (
        <ButtonDiv>
          <ShowParticipantsBtn onClick={handleClick}>Show Participants</ShowParticipantsBtn>
        </ButtonDiv>
      )}
    </ContentDiv>
  )
}
