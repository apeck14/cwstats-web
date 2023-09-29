import Image from "next/image"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { bronze, bronzeOrange, goldOrange, goldYellow, gray, silver, silverWhite } from "../../../public/static/colors"

const Flag = styled(Image)``

const Rank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: ${gray["0"]};
  font-size: 1rem;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  box-shadow: ${({ $borderColor }) => `0 0 0 2px ${$borderColor}`};
  border-radius: 0.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    height: 1.25rem;
    width: 1.25rem;
    font-size: 0.9rem;
    border-radius: 0.25rem;
  }
`

const getBackgroundColor = (rank) => {
  if (rank === 1) return goldOrange
  if (rank === 2) return silver
  if (rank === 3) return bronze

  return gray["50"]
}

const getBorderColor = (rank) => {
  if (rank === 1) return goldYellow
  if (rank === 2) return silverWhite
  if (rank === 3) return bronzeOrange

  return gray["25"]
}

export default function RaceIcon({ isFinished, place }) {
  const { width } = useWindowSize()

  const isMobile = width <= 480
  const size = isMobile ? 24 : 32

  if (isFinished) return <Flag alt="Flag" height={size} src="/assets/icons/flag.png" width={size} />

  return (
    <Rank $backgroundColor={getBackgroundColor(place)} $borderColor={getBorderColor(place)}>
      {place}
    </Rank>
  )
}
