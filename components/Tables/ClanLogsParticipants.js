import Image from "next/image"
import { useRouter } from "next/router"
import styled from "styled-components"
import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"

const Table = styled.table({
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "1rem",
})

const TH = styled.th({
    color: gray["25"],
    padding: "0.5rem 0.25rem",
    borderBottom: `3px solid ${gray["50"]}`,
    textAlign: ({ textAlign }) => textAlign || null,
    background: `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,

    "@media (max-width: 480px)": {
        fontSize: "0.8rem",
    },
})

const Row = styled.tr({
    color: gray["0"],
})

const Cell = styled.td({
    height: "3rem",
    padding: "0 0.25rem",
    fontFamily: "SansPro600",
    textAlign: ({ textAlign }) => textAlign || null,
    backgroundColor: ({ index }) => (index % 2 === 0 ? gray["75"] : "#2e2f30"),

    "@media (max-width: 1024px)": {
        padding: "0 0.5rem",
        fontSize: "0.9rem",
    },

    "@media (max-width: 480px)": {
        height: "2rem",
        padding: "0 0.25rem",
        fontSize: "0.75rem",
    },
})

const Icon = styled(Image)({
    verticalAlign: "middle",
})

const Name = styled.span({
    ":hover, :active": {
        color: pink,
        cursor: "pointer",
    },
})

export default function ClanLogsParticipants({ participants }) {
    const router = useRouter()
    const { width } = useWindowSize()
    const sortedParticipants = participants
        .filter((p) => p.fame > 0)
        .sort((a, b) => b.fame - a.fame)

    const isMobile = width <= 480
    const iconPx = isMobile ? 14 : 18

    return (
        <Table>
            <thead>
                <Row>
                    <TH>#</TH>
                    <TH textAlign="left">
                        Participants: {sortedParticipants.length}
                    </TH>
                    <TH>
                        <Icon
                            src="/assets/icons/decks.png"
                            width={iconPx}
                            height={iconPx}
                        />
                    </TH>
                    <TH>
                        <Icon
                            src="/assets/icons/boat-attack-points.png"
                            width={isMobile ? 15 : 19}
                            height={iconPx}
                        />
                    </TH>
                    <TH>
                        <Icon
                            src="/assets/icons/fame.png"
                            width={isMobile ? 10 : 13}
                            height={iconPx}
                        />
                    </TH>
                </Row>
            </thead>

            <tbody>
                {sortedParticipants.map((p, index) => {
                    return (
                        <Row key={index}>
                            <Cell index={index} textAlign="center">
                                {index + 1}
                            </Cell>
                            <Cell index={index}>
                                <Name
                                    onClick={() =>
                                        router.push(
                                            `/player/${p.tag.substring(1)}`
                                        )
                                    }
                                >
                                    {p.name}
                                </Name>
                            </Cell>
                            <Cell index={index} textAlign="center">
                                {p.decksUsed}
                            </Cell>
                            <Cell index={index} textAlign="center">
                                {p.boatAttacks}
                            </Cell>
                            <Cell index={index} textAlign="center">
                                {p.fame}
                            </Cell>
                        </Row>
                    )
                })}
            </tbody>
        </Table>
    )
}
