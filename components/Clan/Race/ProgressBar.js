import { useEffect, useState } from "react"
import styled from "styled-components"

import { gray, orange, pink } from "../../../public/static/colors"

const Main = styled.div({
  "@media (max-width: 768px)": {
    height: "0.75rem",
  },
  backgroundColor: gray["50"],
  borderRadius: "0.25rem",
  height: "1rem",
  position: "relative",

  width: "100%",
})

const Projected = styled.div({
  backgroundColor: orange,
  borderRadius: "0.25rem",
  height: "100%",
  position: "absolute",
  transition: "width 2s",
  width: "0%",
})

const Progress = styled(Projected)({
  backgroundColor: pink,
})

export default function ProgressBar({ fame, projectedFame, isColosseum }) {
  const [startAnimation, setStartAnimation] = useState(false)

  useEffect(() => {
    setStartAnimation(true)
  }, [])

  const maxFame = isColosseum ? 180000 : 45000
  const famePerc = (fame / maxFame) * 100
  const projFamePerc = (projectedFame / maxFame) * 100

  return (
    <Main>
      <Projected
        style={
          startAnimation
            ? {
                width: `${projFamePerc > 100 ? 100 : projFamePerc}%`,
              }
            : null
        }
      />
      <Progress
        style={
          startAnimation
            ? {
                width: `${famePerc > 100 ? 100 : famePerc}%`,
              }
            : null
        }
      />
    </Main>
  )
}
