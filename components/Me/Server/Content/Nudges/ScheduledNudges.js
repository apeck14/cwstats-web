import { useEffect, useState } from "react"
import { FaTrashAlt } from "react-icons/fa"
import styled from "styled-components"

import useWindowSize from "../../../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../../../public/static/colors"
import { getTimeFromOffset } from "../../../../../utils/date-time"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
`

const Nudge = styled.div`
  border-radius: 0.25rem;
  background-color: ${gray["50"]};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  align-items: center;
`

const Text = styled.p`
  color: ${gray["0"]};
  font-weight: 600;
`

const GrayText = styled(Text)`
  color: ${gray["25"]};
`

const Orange = styled.span`
  color: ${orange};
  margin-right: 2px;
`

const None = styled.p`
  color: ${gray["25"]};
  font-style: italic;
`

const Delete = styled(FaTrashAlt)`
  color: ${orange};

  :hover,
  :active {
    color: ${pink};
    cursor: pointer;
  }
`

export default function ScheduledNudges({ nudges, channels }) {
  const { width } = useWindowSize()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!nudges || nudges.length === 0) {
    return <None>No scheduled nudges set!</None>
  }

  if (!hydrated) return null

  return (
    <Container>
      {nudges.map((n) => (
        <Nudge>
          <Text>{n.clanName}</Text>
          {width >= 768 && <GrayText>{n.clanTag}</GrayText>}
          <Text>{getTimeFromOffset(n.scheduledHour)}</Text>
          <GrayText>
            <Orange>#</Orange>
            {channels.find((c) => c.id === n.channelID).name}
          </GrayText>
          <Delete />
        </Nudge>
      ))}
    </Container>
  )
}
