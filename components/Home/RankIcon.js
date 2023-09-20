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

export default function AvgFameIcon({ average, rank, width, height, borderRadius, maxWidth, borderWidth, fontSize }) {
  return (
    <Main
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $maxWidth={maxWidth}
      $backgroundColor={getBackgroundColor(rank)}
      $borderColor={getBorderColor(rank)}
      $borderWidth={borderWidth}
      $fontSize={fontSize}
    >
      {average.toFixed(2)}
    </Main>
  )
}
