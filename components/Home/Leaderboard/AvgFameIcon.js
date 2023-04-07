import {
    bronze,
    bronzeOrange,
    goldOrange,
    goldYellow,
    gray,
    silver,
    silverWhite,
} from "../../../public/static/colors.js"

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

export default function AvgFameIcon({ number, dailyRank, size }) {
    const sizeFactor = Number(size) || 1

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${sizeFactor}rem`,
                fontFamily: "SansPro700",
                padding: `${2 * sizeFactor}px ${4 * sizeFactor}px`,
                height: `${30 * sizeFactor}px`,
                width: `${50 * sizeFactor}px`,
                backgroundColor: getBackgroundColor(dailyRank),
                borderRadius: `${10 * sizeFactor}px`,
                borderWidth: `${2 * sizeFactor}px`,
                borderColor: getBorderColor(dailyRank),
                borderStyle: "solid",
            }}
        >
            {number.toFixed(2)}
        </div>
    )
}
