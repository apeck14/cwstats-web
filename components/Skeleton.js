import styled, { keyframes } from "styled-components"

import { gray } from "../public/static/colors"

const SkeletonLoading = keyframes`
  from {
    background-position: -200px 0;
  }
  to {
    background-position: calc(200px + 100%) 0;
  }
`

const Main = styled.div`
  animation: ${SkeletonLoading} 1.3s ease-in-out infinite;
  border-radius: ${({ $borderRadius }) => $borderRadius || "0.25rem"};
  width: ${({ $width }) => $width || "20rem"};
  height: ${({ $height }) => $height || "2rem"};
  margin: ${({ $margin }) => $margin || "0"};
  background-color: #666f73;
  background-image: linear-gradient(90deg, #666f73, ${gray["25"]}, #666f73);
  background-size: 200px 100%;
  background-repeat: no-repeat;
`

export default function Skeleton({ borderRadius, height, width, margin }) {
  return <Main $borderRadius={borderRadius} $height={height} $width={width} $margin={margin} />
}
