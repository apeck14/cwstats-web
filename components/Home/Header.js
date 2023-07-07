import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"
import SearchBar from "./SearchBar"

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4.5rem 0;
`

const HeaderText = styled.h1`
  color: ${gray["0"]};
  font-size: 3.5rem;

  @media (max-width: 480px) {
    font-size: 2.75rem;
  }

  @media (max-width: 380px) {
    font-size: 2.5rem;
  }
`

const SubHeader = styled.h3`
  color: ${gray["25"]};
  font-size: 1.35rem;
  text-align: center;
  padding: 0 4.5rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0 3rem;
  }

  @media (max-width: 380px) {
    font-size: 1.15rem;
    margin-top: 0.5rem;
  }
`

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 7rem;
  row-gap: 1.5rem;
  margin-top: 4rem;
  padding: 0 3rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`

const SearchDiv = styled.div``

const SearchHeader = styled.p`
  color: ${pink};
  font-weight: 700;
  text-align: center;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;

  @media (max-width: 420px) {
    font-size: 1.1rem;
  }
`

export default function Header() {
  return (
    <Main className="full-width">
      <HeaderText>Everything CW.</HeaderText>
      <SubHeader>Detailed clan war analytics, leadeboards, projections & more!</SubHeader>

      <SearchContainer>
        <SearchDiv>
          <SearchHeader>Players</SearchHeader>
          <SearchBar
            placeholder="Name or tag, e.g. VGRQ9CVG"
            isPlayerSearch
            showLiveResults
          />
        </SearchDiv>
        <SearchDiv>
          <SearchHeader>Clans</SearchHeader>
          <SearchBar placeholder="Name or tag, e.g. 9U82JJ0Y" showLiveResults />
        </SearchDiv>
      </SearchContainer>
    </Main>
  )
}
