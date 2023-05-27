import { useEffect, useState } from "react"
import styled from "styled-components"

import { gray } from "../../../../../public/static/colors"
import { getTimeFromOffset } from "../../../../../utils/date-time"

const Nudge = styled.div`
  border-radius: 0.25rem;
  background-color: ${gray["50"]};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`

const Text = styled.p``

const None = styled.p`
  color: ${gray["25"]};
  font-style: italic;
`

export default function ScheduledNudges({ nudges }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!nudges || nudges.length === 0) {
    return <None>No scheduled nudges set!</None>
  }

  if (!hydrated) return null

  return nudges.map((n) => (
    <Nudge>
      <Text>{n.clanName}</Text>
      <Text>{n.clanTag}</Text>
      <Text>{getTimeFromOffset(n.scheduledHour)}</Text>
    </Nudge>
  ))
}
