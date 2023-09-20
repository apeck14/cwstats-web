import { FaTrashAlt } from "react-icons/fa"
import styled from "styled-components"

import { gray, orange, pink } from "../../../../../public/static/colors"

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${gray["50"]};
  margin: 0.25rem 0;
  padding: 0.75rem;
  align-items: center;
  border-radius: 0.25rem;
  gap: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

const Number = styled.div`
  flex: 0.1;
  color: ${gray["0"]};
  font-weight: 800;
  background-color: ${gray["75"]};
  text-align: center;
  border-radius: 0.5rem;
  padding: 0.1rem 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const Abbr = styled.p`
  color: ${pink};
  flex: 0.25;
  background-color: ${gray["75"]};
  text-align: center;
  border-radius: 0.5rem;
  padding: 0.1rem;
  font-weight: 700;

  @media (max-width: 480px) {
    flex: 0.5;
    font-size: 0.8rem;
  }
`

const Text = styled.p`
  color: ${({ color }) => color || gray["0"]};
  flex: ${({ flex }) => flex || 1};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const Delete = styled(FaTrashAlt)`
  color: ${orange};

  &:hover {
    color: ${pink};
    cursor: pointer;
  }
`

export default function Item({ abbr, index, handleDelete }) {
  return (
    <Main>
      <Number>{index + 1}</Number>
      <Abbr>{abbr.abbr.toLowerCase()}</Abbr>
      <Text flex={1.5}>{abbr.name}</Text>
      <Text color={gray["25"]}>{abbr.tag}</Text>
      <Delete onClick={() => handleDelete(abbr.abbr)} />
    </Main>
  )
}
