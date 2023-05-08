import styled from "styled-components"

import { gray } from "../../../../public/static/colors"

const Main = styled.div`
  background-color: ${gray["75"]};
  border-radius: 0.5rem;
  min-height: 20rem;
  padding: 2rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    padding: 1rem;
    margin: 1rem 0;
  }
`

export default function TabContent({ children }) {
  return <Main>{children}</Main>
}
