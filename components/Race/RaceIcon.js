import Image from "next/image"
import styled from "styled-components"
import useWindowSize from "../../hooks/useWindowSize"
import {
    bronze,
    bronzeOrange,
    goldOrange,
    goldYellow,
    gray,
    silver,
    silverWhite,
} from "../../public/static/colors"

const Flag = styled(Image)({
    margin: "0 auto",

    "@media (min-width: 651px)": {
        marginRight: "1rem",
    },
})

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

export default function RaceIcon({ place, isFinished }) {
    const { width } = useWindowSize()

    const isMobile = width <= 480
    const size = isMobile ? 24 : 32

    if (isFinished)
        return (
            <Flag
                src="/assets/icons/flag1.png"
                height={size}
                width={size}
                alt="Flag"
            />
        )
    if (place === Infinity) return null

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: `${size - 4}px`,
                minWidth: `${size - 4}px`,
                width: `${size - 4}px`,
                color: gray["0"],
                fontSize: isMobile ? "0.9rem" : "1rem",
                backgroundColor: getBackgroundColor(place),
                border: `2px solid ${getBorderColor(place)}`,
                borderRadius: "0.5rem",
                marginRight: "1rem",
            }}
        >
            {place}
        </div>
    )
}
