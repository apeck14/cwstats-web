import styled from "styled-components"

import { gray } from "../public/static/colors"

const Main = styled.div`
  height: ${({ $height }) => $height || "2px"};
  width: ${({ $width }) => $width || "100%"};
  background-color: ${({ $color }) => $color || gray["75"]};
  margin: ${({ $margin }) => $margin || 0};
`

export default function Hr({ color, height, margin, width }) {
  return <Main $color={color} $height={height} $margin={margin} $width={width} />
}
