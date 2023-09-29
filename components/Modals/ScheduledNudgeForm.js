import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

import useToggleBodyScroll from "../../hooks/useToggleBodyScroll"
import { errorRed, gray, orange, pink } from "../../public/static/colors"
import { convertHourToUTC, getUsersTimezone } from "../../utils/date-time"
import { formatTag } from "../../utils/functions"
import { addScheduledNudge } from "../../utils/services"
import LoadingSpinner from "../LoadingSpinner"
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
    width: 90%;
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
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
`

const Error = styled.p`
  color: ${errorRed};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const ButtonDiv = styled.div`
  display: flex;
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

  &::placeholder {
    color: ${gray["50"]};
  }
`

const Button = styled.button`
  background-color: ${({ $color }) => $color};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: ${gray["0"]};
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem 0.9rem;
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ $color }) => ($color === gray["100"] ? gray["50"] : orange)};
  }
`

const AMPM = ["A.M.", "P.M."]
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default function ScheduledNudgeFormModal({ channels, isOpen, scheduledNudges, setIsOpen, setScheduledNudges }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tag, setTag] = useState("")
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || null)
  const [selectedAmPm, setSelectedAmPm] = useState(AMPM[0])
  const [selectedHour, setSelectedHour] = useState(HOURS[0])
  useToggleBodyScroll(!isOpen)

  const validateForm = () => {
    if (channels.length === 0) {
      setError("No text channel selected.")
      return false
    }

    if (!tag) {
      setError("No tag set.")
      return false
    }

    const validTag = tag.match(/^[A-Za-z0-9#]+$/)
    if (!validTag || tag.length < 5) {
      setError("Invalid tag format.")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    const newScheduledNudge = {
      channelID: selectedChannel.id,
      clanTag: formatTag(tag, true),
      scheduledHourUTC: convertHourToUTC(selectedHour, selectedAmPm),
      serverId: router.query.serverId,
    }

    const resp = await addScheduledNudge(newScheduledNudge)
    const { clanName, message, success } = await resp.json()

    if (success) {
      setScheduledNudges([...scheduledNudges, { ...newScheduledNudge, clanName }])
      setIsOpen(false)
      setError("")
      setTag("")
      setSelectedAmPm(AMPM[0])
      setSelectedHour(HOURS[0])
    } else {
      setError(message)
    }

    setIsLoading(false)
  }

  const handleCancel = () => {
    setError("")
    setIsOpen(false)
    setSelectedChannel(channels[0] || null)
    setSelectedAmPm(AMPM[0])
    setSelectedHour(HOURS[0])
    setTag("")
    setIsLoading(false)
  }

  const handleTagChange = (e) => {
    setTag(e.target.value)
  }

  const { offset, timezone } = getUsersTimezone()

  return (
    isOpen && (
      <Background onClick={() => setIsOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>Add Scheduled Nudge</Header>
          <Content>
            <SubHeader>
              Clan Tag <Gray>(#ABC123)</Gray>
            </SubHeader>
            <Input maxLength={10} onChange={handleTagChange} />
            <SubHeader>Time</SubHeader>
            <Timezone>
              Timezone: {timezone} ({offset})
            </Timezone>
            <Row>
              <DropdownMenuComponent currentItem={selectedHour} setCurrentItem={setSelectedHour} values={HOURS} />
              <DropdownMenuComponent currentItem={selectedAmPm} setCurrentItem={setSelectedAmPm} values={AMPM} />
            </Row>
            <SubHeader>Channel</SubHeader>
            <DropdownMenuComponent
              currentItem={selectedChannel}
              isChannels
              setCurrentItem={setSelectedChannel}
              values={channels}
            />
          </Content>
          <Footer>
            <Error>{error}</Error>
            <ButtonDiv>
              <Button $color={gray["100"]} onClick={handleCancel}>
                Cancel
              </Button>
              <Button color={pink} onClick={handleSubmit}>
                {isLoading ? <LoadingSpinner lineWidth={2} size="0.75rem" /> : "Add"}
              </Button>
            </ButtonDiv>
          </Footer>
        </Modal>
      </Background>
    )
  )
}
