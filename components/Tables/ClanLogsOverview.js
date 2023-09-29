import { groupBy } from "lodash"
import Image from "next/image"
import { FaTrophy } from "react-icons/fa"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"
import { getAvgFameOfLog } from "../../utils/functions"

const SeasonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  table-layout: fixed;
`

const TH = styled.th`
  color: ${gray["25"]};
  border-bottom: 2px solid ${pink};
  padding: 0.5rem 0.75rem;
  text-align: ${({ align }) => align || "center"};

  @media (max-width: 480px) {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
`

const Row = styled.tr`
  color: ${gray["0"]};
  background-color: ${({ isHeader }) => (isHeader ? "inherit" : gray["75"])};

  &:hover {
    background-color: ${({ isHeader }) => !isHeader && gray["100"]};
    cursor: ${({ isHeader }) => !isHeader && "pointer"};
  }
`

const Cell = styled.td`
  height: 2rem;
  font-size: 0.9rem;
  padding: 0 0.75rem;
  border-top: 1px solid ${gray["50"]};
  text-align: ${({ align }) => align || "left"};

  @media (max-width: 1024px) {
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.4rem;
    font-size: 0.7rem;
  }
`

const ThIcon = styled(Image)``

const Trophy = styled(FaTrophy)``

const TrophyChange = styled.span`
  color: ${gray["25"]};
  margin-right: 0.25rem;
`

export default function ClanLogsOverview({ clanTag, log }) {
  const { width } = useWindowSize()

  const isMobile = width <= 480
  const iconPx = isMobile ? 14 : 18

  const groupedLogsBySeason = groupBy(log, "seasonId")

  const handleClickScroll = (seasonId, sectionIndex) => {
    const element = document.getElementById(`${seasonId}-${sectionIndex}`)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  return Object.keys(groupedLogsBySeason)
    .reverse()
    .map((sId) => (
      <SeasonTable key={sId}>
        <thead>
          <Row isHeader>
            <TH align="left">Season {sId}</TH>
            <TH>
              <Trophy />
            </TH>
            <TH>
              <ThIcon
                height={iconPx}
                src="/assets/icons/boat-movement.png"
                width={isMobile ? 16 : 21}
              />
            </TH>
            <TH>
              <ThIcon height={iconPx} src="/assets/icons/battle.png" width={iconPx} />
            </TH>
            <TH align="right">
              <ThIcon height={iconPx} src="/assets/icons/cw-trophy.png" width={iconPx} />
            </TH>
          </Row>
        </thead>
        <tbody>
          {groupedLogsBySeason[sId].map((w) => {
            const clan = w.standings.find((c) => c.clan.tag === clanTag)
            const trophyChange = `${clan.trophyChange < 0 ? "" : "+"}${clan.trophyChange}`

            return (
              <Row
                key={`${w.seasonId}${w.sectionIndex}`}
                onClick={() => handleClickScroll(w.seasonId, w.sectionIndex)}
              >
                <Cell>W{w.sectionIndex + 1}</Cell>
                <Cell align="center">{clan.rank}</Cell>
                <Cell align="center">{clan.clan.fame}</Cell>
                <Cell align="center">
                  {getAvgFameOfLog(
                    clan.clan,
                    w.createdDate,
                    clan.clan.finishTime
                  ).toFixed(1)}
                </Cell>
                <Cell align="right">
                  <TrophyChange>{trophyChange}</TrophyChange>
                  {clan.clan.clanScore}
                </Cell>
              </Row>
            )
          })}
        </tbody>
      </SeasonTable>
    ))
}
