import Image from "next/image"
import { useRouter } from "next/router"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import { getAvgFame, getProjFame, getRaceDetails } from "../../../utils/functions"
import ProgressBar from "./ProgressBar"
import RaceIcon from "./RaceIcon"

const RaceDiv = styled.div`
  margin: 1rem 0;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`

const ClanDiv = styled.div`
  display: flex;
  column-gap: 1rem;
  background-color: ${gray["75"]};
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: ${({ $isClan }) => $isClan && `0 0 0 3px ${gray["50"]}`};

  &:hover {
    cursor: pointer;
    box-shadow: ${({ $isClan }) => `0 0 0 ${$isClan ? 3 : 2}px ${gray["50"]}`};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    column-gap: 0.75rem;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;

  @media (max-width: 768px) {
    row-gap: 0.25rem;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
  color: ${gray["0"]};
  font-weight: 600;
  column-gap: 1rem;

  div:not(:first-child) {
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    column-gap: 0.75rem;
    font-size: 0.85rem;

    div:first-child {
      flex: 2;
    }
  }
`

const Column = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const Badge = styled(Image)``

const Name = styled.p`
  font-weight: 700;
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    font-weight: 600;
    margin-left: 0.4rem;
  }
`

const IconDiv = styled(Column)`
  justify-content: center;
  max-width: 1.5rem;

  @media (max-width: 768px) {
    max-width: 1.25rem;
  }
`

const Icon = styled(Image)`
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    margin-left: 0.25rem;
  }
`

const AvgFame = styled.p`
  background-color: ${gray["50"]};
  height: 2rem;
  width: 4.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  @media (max-width: 768px) {
    height: 1.5rem;
    width: 3.25rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
`

export default function Race({ dayOfWeek, isColosseum, race }) {
  const router = useRouter()
  const { width } = useWindowSize()

  const handleClick = (tag) => {
    if (router.query.tag !== tag.substring(1)) {
      router.push(`/clan/${tag.substring(1)}/race`)
    }
  }

  const raceClans = getRaceDetails(race.clans, isColosseum)

  const showMobileView = width <= 768

  return (
    <RaceDiv>
      {raceClans.map((c) => {
        const clanInRace = race.clans.find((cl) => cl.tag === c.tag)

        return (
          <ClanDiv $isClan={c.tag === race.clan.tag} key={c.tag} onClick={() => handleClick(c.tag)}>
            {(c.placement !== Infinity || c.crossedFinishLine) && (
              <IconDiv>
                <RaceIcon isFinished={c.crossedFinishLine} place={c.placement} />
              </IconDiv>
            )}

            <Content>
              <Row>
                <Column>
                  <Badge
                    alt={c.name}
                    height={showMobileView ? 24 : 32}
                    src={`/assets/badges/${getClanBadgeFileName(c.badgeId, c.trophies)}.png`}
                    width={showMobileView ? 18 : 24}
                  />
                  <Name>{c.name}</Name>
                </Column>

                {!showMobileView && (
                  <Column>
                    {c.trophies}
                    <Icon
                      alt="War Trophies"
                      height={showMobileView ? 18 : 20}
                      src="/assets/icons/cw-trophy.png"
                      width={showMobileView ? 18 : 20}
                    />
                  </Column>
                )}

                <Column>
                  {c.boatPoints}
                  <Icon
                    alt="Boat Points"
                    height={showMobileView ? 18 : 20}
                    src="/assets/icons/boat-movement.png"
                    width={showMobileView ? 22 : 24}
                  />
                </Column>

                <Column>
                  {c.fame}
                  <Icon
                    alt="Fame"
                    height={showMobileView ? 18 : 20}
                    src="/assets/icons/fame.png"
                    width={showMobileView ? 13 : 15}
                  />
                </Column>
              </Row>

              {/* Progress Bar & Avg Fame */}
              {!c.crossedFinishLine && (
                <Row>
                  <ProgressBar
                    fame={c.fame}
                    isColosseum={isColosseum}
                    projectedFame={getProjFame(clanInRace, isColosseum, dayOfWeek)}
                  />
                  <AvgFame>{getAvgFame(clanInRace, isColosseum, dayOfWeek).toFixed(2)}</AvgFame>
                </Row>
              )}
            </Content>
          </ClanDiv>
        )
      })}
    </RaceDiv>
  )
}
