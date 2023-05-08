import { IoMdCheckmark } from "react-icons/io"
import styled from "styled-components"

import { gray, pink } from "../../../../../public/static/colors"

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: ${({ isActive }) => (isActive ? null : `2px solid ${gray[50]}`)};
  background-color: ${({ isActive }) => (isActive ? pink : gray["100"])};
  height: ${({ isActive }) => (isActive ? "20px" : "16px")};
  width: ${({ isActive }) => (isActive ? "20px" : "16px")};
  margin-right: 1rem;
`

const Checkmark = styled(IoMdCheckmark)`
  color: ${gray["0"]};
  font-size: 1rem;
`

export default function CheckmarkToggle({ isActive }) {
  return <Circle isActive={isActive}>{isActive && <Checkmark />}</Circle>
}
