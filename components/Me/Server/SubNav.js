import { useRouter } from "next/router"
import { FaHome } from "react-icons/fa"
import styled from "styled-components"

import { gray, orange, pink } from "../../../public/static/colors"

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`

const Back = styled.button`
  background-color: ${pink};
  padding: 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }
`

const Icon = styled(FaHome)`
  color: ${gray["0"]};
  font-size: 1.25rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

const Nav = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

const Item = styled.div`
  padding: 0.25rem 0;
  border-bottom: ${({ isActive }) => (isActive ? `2px solid ${pink}` : null)};

  :hover,
  :active {
    border-bottom: 2px solid ${pink};
    cursor: pointer;
  }
`

const Text = styled.p`
  color: ${gray["0"]};
  font-size: 1.2rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

export default function SubNav({ tab, setTab }) {
  const router = useRouter()

  const handleBack = () => {
    router.push("/me")
  }

  const handleClick = (e) => {
    setTab(e.currentTarget.id)
  }

  return (
    <Main>
      <Back onClick={handleBack}>
        <Icon />
      </Back>

      <Nav>
        <Item
          id="abbreviations"
          onClick={handleClick}
          isActive={tab === "abbreviations"}
          className="noselect"
        >
          <Text>Abbreviations</Text>
        </Item>
        <Item
          id="channels"
          onClick={handleClick}
          isActive={tab === "channels"}
          className="noselect"
        >
          <Text>Channels</Text>
        </Item>
        <Item
          id="report"
          onClick={handleClick}
          isActive={tab === "report"}
          className="noselect"
        >
          <Text>Daily Report</Text>
        </Item>
      </Nav>
    </Main>
  )
}
