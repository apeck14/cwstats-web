import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaTrashAlt } from "react-icons/fa"
import styled from "styled-components"

import useWindowSize from "../../../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../../../public/static/colors"
import { getTimeFromOffset } from "../../../../../utils/date-time"
import { removeScheduledNudge } from "../../../../../utils/services"

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
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  align-items: center;
  column-gap: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.75rem;
    column-gap: 0.25rem;
  }

  p:not(:first-child) {
    text-align: center;
  }
`

const Text = styled.p`
  color: ${gray["0"]};
  font-weight: 600;
  flex: 1;
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

  &:hover {
    color: ${pink};
    cursor: pointer;
  }
`

export default function ScheduledNudges({ channels, nudges, setNudges }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!nudges || nudges.length === 0) {
    return <None>No scheduled nudges set!</None>
  }

  if (!hydrated) return null

  const handleDelete = (tag, hour) => {
    setNudges(nudges.filter((n) => n.clanTag !== tag || n.scheduledHourUTC !== hour))

    removeScheduledNudge({
      clanTag: tag,
      scheduledHourUTC: hour,
      serverId: router.query.serverId,
    })
  }

  return (
    <Container>
      {nudges.map((n) => (
        <Nudge key={`${n.clanTag}${n.scheduledHourUTC}`}>
          <Text>{n.clanName}</Text>
          {width >= 768 && <GrayText>{n.clanTag}</GrayText>}
          <Text>{getTimeFromOffset(n.scheduledHourUTC)}</Text>
          <GrayText>
            <Orange>#</Orange>
            {channels.find((c) => c.id === n.channelID).name}
          </GrayText>
          <Delete onClick={() => handleDelete(n.clanTag, n.scheduledHourUTC)} />
        </Nudge>
      ))}
    </Container>
  )
}
