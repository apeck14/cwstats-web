import { Cross as Hamburger } from "hamburger-react"
import styled from "styled-components"

import { gray } from "../../public/static/colors"

const Wrapper = styled.div`
  display: flex;
`

export default function HamburgerMenu({ isOpen, setIsOpen }) {
  return (
    <Wrapper>
      <Hamburger toggled={isOpen} toggle={setIsOpen} color={gray["25"]} size={24} direction="right" rounded />
    </Wrapper>
  )
}
