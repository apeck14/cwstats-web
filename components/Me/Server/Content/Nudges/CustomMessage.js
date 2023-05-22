import styled from "styled-components"

import { gray } from "../../../../../public/static/colors"

const TextBox = styled.textarea`
  border: none;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 1rem;
  color: ${gray["25"]};
  background-color: ${gray["100"]};
  resize: none;
  box-shadow: none;
  overflow: auto;
  min-height: 5rem;
  box-sizing: border-box;
  padding: 0.75rem;
  outline: none;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
`

export default function CustomMessage() {
  return (
    <TextBox
      placeholder="**You have attacks remaining.** Please get them in before the deadline!"
      maxLength={200}
    />
  )
}
