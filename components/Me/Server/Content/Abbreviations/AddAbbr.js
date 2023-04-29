import styled from "styled-components"

import { gray, orange, pink } from "../../../../../public/static/colors"

const Main = styled.div`
  display: flex;
  margin-top: 1rem;
  height: 2rem;
  align-items: center;
`

const Abbr = styled.input`
  border-radius: 0.25rem;
  width: 4rem;
  padding: 0.5rem;
  background-color: ${gray["100"]};
  color: ${gray["0"]};
  font-weight: 700;
`

const Tag = styled(Abbr)`
  width: 6rem;
  margin-left: 0.5rem;
`

const Add = styled.button`
  margin-left: 1rem;
  background-color: ${pink};
  color: ${gray["0"]};
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${orange};
  }
`

export default function AddAbbr({ data }) {
  return (
    <Main>
      <Abbr placeholder="abbr" />
      <Tag placeholder="#CLANTAG" />
      <Add>Add</Add>
    </Main>
  )
}
