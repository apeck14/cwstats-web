import styled from "styled-components"

import { gray } from "../public/static/colors"

const Main = styled.div`
  height: ${({ height }) => height || "2px"};
  width: ${({ width }) => width || "100%"};
  background-color: ${({ color }) => color || gray["75"]};
`

export default function Hr({ height, width, color }) {
  return <Main height={height} width={width} color={color} />
}
