import {
    bronze,
    bronzeOrange,
    goldOrange,
    goldYellow,
    gray,
    silver,
    silverWhite,
} from "../../../public/static/colors"

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontFamily: "SansPro700",
    padding: "2px",
    borderWidth: "3px",
}

const getFontSize = (circleSize) => {
    return `${Number(circleSize.slice(0, circleSize.indexOf("p"))) * 0.6}px`
}

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

export default function RankIcon({ number, size }) {
    return (
        <div
            style={{
                ...style,
                height: size,
                width: size,
                fontSize: getFontSize(size),
                backgroundColor: getBackgroundColor(number),
                border: `2px solid ${getBorderColor(number)}`,
            }}
        >
            {number}
        </div>
    )
}
