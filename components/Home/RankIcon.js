import styled from "styled-components"

import { gray } from "../../public/static/colors"
import { getBackgroundColor, getBorderColor } from "../../utils/functions"

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $width }) => $width || "4rem"};
  height: ${({ $height }) => $height || "2rem"};
  border-radius: ${({ $borderRadius }) => $borderRadius || "0.5rem"};
  border-color: ${({ $borderColor }) => $borderColor};
  border-style: solid;
  border-width: ${({ $borderWidth }) => $borderWidth || "0.2rem"};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  max-width: ${({ $maxWidth }) => $maxWidth || "5rem"};
  color: ${gray["0"]};
  font-weight: 700;
  font-size: ${({ $fontSize }) => $fontSize || "1rem"};
`

export default function AvgFameIcon({ average, borderRadius, borderWidth, fontSize, height, maxWidth, rank, width }) {
  return (
    <Main
      $backgroundColor={getBackgroundColor(rank)}
      $borderColor={getBorderColor(rank)}
      $borderRadius={borderRadius}
      $borderWidth={borderWidth}
      $fontSize={fontSize}
      $height={height}
      $maxWidth={maxWidth}
      $width={width}
    >
      {average.toFixed(2)}
    </Main>
  )
}
