import groupBy from "lodash/groupBy"
import styled from "styled-components"

import { gray } from "../../../public/static/colors"
import Hr from "../../Hr"
import DailyAvgMeter from "./DailyAvgMeter"

const Main = styled.div`
  background-color: transparent;
  border: 2px solid ${gray["75"]};
  padding: 0.5rem;
  width: 25%;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 15rem;

  @media (max-width: 480px) {
    width: 100%;
  }
`

const Title = styled.h3`
  color: ${gray["0"]};
  font-weight: 600;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  background-color: ${({ $isActive }) => ($isActive ? gray["50"] : "transparent")};

  &:hover {
    background-color: ${gray["50"]};
    cursor: pointer;
  }
`

const Day = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 0.5rem;
  row-gap: 0.5rem;
  background-color: ${({ $isActive }) => ($isActive ? gray["75"] : "transparent")};

  &:hover {
    background-color: ${gray["75"]};
    cursor: pointer;
  }
`

const DayTitle = styled.p`
  color: ${gray["0"]};
  font-weight: 600;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Avg = styled.p`
  color: ${gray["25"]};
`

const DayContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
`

export default function WeekCard({ data, graphDay, graphWeek, setGraphDay, setGraphWeek, weekNum }) {
  const daysObj = groupBy(data, "day")

  const handleClick = (day, week) => {
    setGraphDay(day)
    setGraphWeek(week)
  }

  return (
    <Main>
      <Title $isActive={graphDay === -1 && weekNum === graphWeek} onClick={() => handleClick(-1, weekNum)}>
        Week {weekNum}
      </Title>
      <Hr margin="0.5rem 0" />
      <DayContent>
        {Object.keys(daysObj).map((d) => {
          const avg = daysObj[d][daysObj[d].length - 1].fameAvg
          const perc = (avg / 225) * 100
          const percStr = perc > 100 ? 100 : perc

          const dayNum = Number(d)

          return (
            <Day
              $isActive={dayNum === graphDay && weekNum === graphWeek}
              key={d}
              onClick={() => handleClick(dayNum, weekNum)}
            >
              <Row>
                <DayTitle>Day {d}</DayTitle>
                <Avg>{avg.toFixed(1)}</Avg>
              </Row>
              <DailyAvgMeter perc={percStr} />
            </Day>
          )
        })}
      </DayContent>
    </Main>
  )
}
