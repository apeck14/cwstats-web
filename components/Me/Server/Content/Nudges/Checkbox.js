import React, { useState } from "react"
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
  background-color: ${(props) => (props.checked ? pink : gray["50"])};
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
  position: relative;

  ::after {
    content: ${(props) => (props.checked ? "'\\2714'" : "''")};
    position: absolute;
    display: ${(props) => (props.checked ? "block" : "none")};
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

export default function Checkbox() {
  const [checked, setChecked] = useState(false)

  const handleCheckboxChange = () => {
    setChecked(!checked)
  }

  return (
    <CheckboxContainer>
      <CheckboxInput
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <CheckboxStyled checked={checked} />
      <CheckboxLabel>Ignore Co-Leaders</CheckboxLabel>
    </CheckboxContainer>
  )
}
