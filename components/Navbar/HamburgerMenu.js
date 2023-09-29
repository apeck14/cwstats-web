import { Cross as Hamburger } from "hamburger-react"
import styled from "styled-components"

import { gray } from "../../public/static/colors"

const Wrapper = styled.div`
  display: flex;
`

export default function HamburgerMenu({ isOpen, setIsOpen }) {
  return (
    <Wrapper>
      <Hamburger color={gray["25"]} direction="right" rounded size={24} toggle={setIsOpen} toggled={isOpen} />
    </Wrapper>
  )
}
