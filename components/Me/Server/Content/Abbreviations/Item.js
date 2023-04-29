import { FaTrashAlt } from "react-icons/fa"
import styled from "styled-components"

import { gray, orange, pink } from "../../../../../public/static/colors"

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${gray["50"]};
  margin: 0.25rem 0;
  padding: 0.5rem;
  align-items: center;
  border-radius: 0.25rem;
  gap: 1rem;
`

const Number = styled.div`
  flex: 0.1;
  color: ${gray["0"]};
  font-weight: 800;
  background-color: ${gray["75"]};
  text-align: center;
  border-radius: 0.5rem;
  padding: 0.1rem;
`

const Name = styled.p`
  color: ${pink};
  flex: 0.25;
  background-color: ${gray["75"]};
  text-align: center;
  border-radius: 0.5rem;
  padding: 0.1rem;
  font-weight: 700;
`

const Text = styled.p`
  color: ${({ color }) => color || gray["0"]};
  flex: 1;
  font-weight: 600;
`

const Delete = styled(FaTrashAlt)`
  color: ${orange};

  :hover,
  :active {
    color: ${pink};
    cursor: pointer;
  }
`

export default function Item({ abbr, index, handleDelete }) {
  return (
    <Main>
      <Number>{index + 1}</Number>
      <Name>{abbr.abbr}</Name>
      <Text>{abbr.name}</Text>
      <Text color={gray["25"]}>{abbr.tag}</Text>
      <Delete onClick={() => handleDelete(abbr.abbr)} />
    </Main>
  )
}
