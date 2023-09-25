import { gray } from "../public/static/colors"

const { default: styled } = require("styled-components")

const SpinnerSpan = styled.span`
  width: ${({ $size }) => $size || "48px"};
  height: ${({ $size }) => $size || "48px"};
  border: ${({ $lineWidth, $color }) => `${$lineWidth || 5}px solid ${$color || gray["0"]}`};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.75s linear infinite;
  margin: ${({ $margin }) => $margin};

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default function LoadingSpinner({ size, lineWidth, color, margin }) {
  return <SpinnerSpan $size={size} $lineWidth={lineWidth} $color={color} $margin={margin} />
}
