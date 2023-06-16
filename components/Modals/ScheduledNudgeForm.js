import styled from "styled-components"

import useToggleBodyScroll from "../../hooks/useToggleBodyScroll"
import { gray, orange, pink } from "../../public/static/colors"
import { getUsersTimezone } from "../../utils/date-time"
import DropdownMenuComponent from "../Me/Server/Content/Nudges/Dropdown"

const Background = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
`

const Modal = styled.div`
  margin: 10% auto;
  width: 25%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 0.5rem;

  @media (max-width: 1024px) {
    width: 75%;
    margin: 15% auto;
  }

  @media (max-width: 480px) {
    width: 85%;
    margin: 25% auto;
  }
`

const Header = styled.div`
  background-color: ${gray["75"]};
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.5rem 1rem;
  color: ${gray["0"]};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`

const Content = styled.div`
  background-color: ${gray["50"]};
  padding: 1rem;

  h2:not(:first-child) {
    margin-top: 1rem;
  }
`

const SubHeader = styled.h2`
  color: ${gray["0"]};
  font-size: 1rem;
  font-weight: 600;
`

const Timezone = styled.h3`
  color: ${gray["25"]};
  font-size: 0.9rem;
  font-weight: 600;
`

const Gray = styled.span`
  color: ${gray["25"]};
`

const Row = styled.div`
  display: flex;
  column-gap: 1rem;
`

const Footer = styled.div`
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: ${gray["75"]};
  padding: 0.75rem;
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
`

const Input = styled.input`
  border-radius: 0.25rem;
  width: 6rem;
  padding: 0.5rem;
  background-color: ${gray["75"]};
  color: ${gray["25"]};
  font-weight: 600;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;

  ::placeholder {
    color: ${gray["50"]};
  }
`

const Button = styled.button`
  background-color: ${({ color }) => color};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: ${gray["0"]};
  font-weight: 700;

  :hover,
  :active {
    cursor: pointer;
    background-color: ${({ color }) =>
      color === gray["100"] ? gray["50"] : orange};
  }
`

export default function ScheduledNudgeFormModal({
  isOpen,
  setIsOpen,
  channels,
}) {
  useToggleBodyScroll(!isOpen)

  const { timezone, offset } = getUsersTimezone()

  return (
    isOpen && (
      <Background onClick={() => setIsOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>Add Scheduled Nudge</Header>
          <Content>
            <SubHeader>
              Clan Tag <Gray>(#ABC123)</Gray>
            </SubHeader>
            <Input maxLength={9} />
            <SubHeader>Time</SubHeader>
            <Timezone>
              Timezone: {timezone} ({offset})
            </Timezone>
            <Row>
              <DropdownMenuComponent
                values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              />
              <DropdownMenuComponent values={["A.M.", "P.M."]} />
            </Row>
            <SubHeader>Channel</SubHeader>
            <DropdownMenuComponent values={channels} isChannels />
          </Content>
          <Footer>
            <Button color={gray["100"]} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color={pink}>Add</Button>
          </Footer>
        </Modal>
      </Background>
    )
  )
}
