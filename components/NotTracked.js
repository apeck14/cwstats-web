import styled from "styled-components"

import { gray, orange } from "../public/static/colors"

const Main = styled.div({
  "@media (max-width: 1024px)": {
    width: "60%",
  },
  "@media (max-width: 480px)": {
    width: "80%",
  },
  backgroundColor: gray["75"],
  border: `3px solid ${orange}`,
  borderRadius: "0.25rem",
  margin: "2rem auto",

  padding: "0.9rem",

  width: "50%",
})

const Text = styled.p({
  "@media (max-width: 480px)": {
    fontSize: "0.75rem",
  },
  color: gray["0"],

  fontSize: "0.9rem",
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
        : This region is not being tracked. Due to limited resouces, major regions are prioritized. Some clans may be
        missing.
      </Text>
    </Main>
  )
}
