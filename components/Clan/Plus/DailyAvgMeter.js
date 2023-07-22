import styled from "styled-components"

import { gray } from "../../../public/static/colors"

const Meter = styled.div`
  width: 100%;
  background-color: ${gray["50"]};
  height: 0.25rem;
  border-radius: 0.25rem;
`

const Avg = styled.div`
  width: ${({ perc }) => `${perc}%`};
  background: rgb(255, 165, 0);
  background: linear-gradient(90deg, rgba(255, 165, 0, 1) 10%, rgba(255, 35, 122, 1) 90%);
  height: 100%;
  border-radius: 0.25rem;
`

export default function DailyAvgMeter({ perc }) {
  return (
    <Meter>
      <Avg perc={perc} />
    </Meter>
  )
}
