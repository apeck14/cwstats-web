import { useEffect, useState } from "react"
import styled from "styled-components"

import { gray, orange, pink } from "../../public/static/colors"

const Main = styled.div({
    backgroundColor: gray["50"],
    width: "100%",
    height: "1rem",
    borderRadius: "0.25rem",
    position: "relative",

    "@media (max-width: 650px)": {
        height: "0.75rem",
    },
})

const Projected = styled.div({
    position: "absolute",
    borderRadius: "0.25rem",
    height: "100%",
    backgroundColor: orange,
    width: "0%",
    transition: "width 2s",
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
                              width: `${
                                  projFamePerc > 100 ? 100 : projFamePerc
                              }%`,
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
