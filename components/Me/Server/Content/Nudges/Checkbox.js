import styled from "styled-components"

import { gray, pink } from "../../../../../public/static/colors"

const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`

const CheckboxStyled = styled.span`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  background-color: ${({ checked }) => (checked ? pink : gray["50"])};
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
  position: relative;

  &::after {
    content: ${({ checked }) => (checked ? "'\\2714'" : "''")};
    position: absolute;
    display: ${({ checked }) => (checked ? "block" : "none")};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }
`

const CheckboxLabel = styled.span`
  color: ${gray["0"]};
  font-weight: 500;
  margin-left: 0.5rem;
`

export default function Checkbox({ isChecked, handleCheckboxChange }) {
  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      <CheckboxStyled checked={isChecked} />
      <CheckboxLabel>Ignore Co-Leaders & Leaders</CheckboxLabel>
    </CheckboxContainer>
  )
}
