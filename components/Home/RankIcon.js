import styled from "styled-components"

import { gray } from "../../public/static/colors"
import { getBackgroundColor, getBorderColor } from "../../utils/functions"

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width || "4rem"};
  height: ${(props) => props.height || "2rem"};
  border-radius: ${(props) => props.borderRadius || "0.5rem"};
  border-color: ${(props) => props.borderColor};
  border-style: solid;
  border-width: ${(props) => props.borderWidth || "0.2rem"};
  background-color: ${(props) => props.backgroundColor};
  max-width: ${(props) => props.maxWidth || "5rem"};
  color: ${gray["0"]};
  font-weight: 700;
  font-size: ${(props) => props.fontSize || "1rem"};
`

export default function AvgFameIcon({
  average,
  rank,
  width,
  height,
  borderRadius,
  maxWidth,
  borderWidth,
  fontSize,
}) {
  return (
    <Main
      width={width}
      height={height}
      borderRadius={borderRadius}
      maxWidth={maxWidth}
      backgroundColor={getBackgroundColor(rank)}
      borderColor={getBorderColor(rank)}
      borderWidth={borderWidth}
      fontSize={fontSize}
    >
      {average.toFixed(2)}
    </Main>
  )
}
