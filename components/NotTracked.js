import styled from "styled-components"
import { gray, orange } from "../public/static/colors"

const Main = styled.div({
    width: "50%",
    margin: "2rem auto",
    border: `3px solid ${orange}`,
    padding: "0.9rem",
    backgroundColor: gray["75"],
    borderRadius: "0.25rem",

    "@media (max-width: 1024px)": {
        width: "60%",
    },

    "@media (max-width: 480px)": {
        width: "80%",
    },
})

const Text = styled.p({
    color: gray["0"],
    fontSize: "0.9rem",

    "@media (max-width: 480px)": {
        fontSize: "0.75rem",
    },
})

export default function NotTracked() {
    return (
        <Main>
            <Text>
                <span
                    style={{
                        textDecoration: "underline",
                    }}
                >
                    IMPORTANT
                </span>
                : This region is not being tracked. Due to limited resouces,
                major regions are prioritized. Some clans may be missing.
            </Text>
        </Main>
    )
}
