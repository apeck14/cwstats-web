import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { gray, orange } from "../../../../../public/static/colors"

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  width: 12rem;
`

const DropdownButton = styled.button`
  background-color: ${gray["75"]};
  color: ${gray["0"]};
  border: none;
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  min-width: 100%;
  font-weight: 600;
  border-radius: 0.25rem 0.25rem 0 0;

  :hover {
    background-color: ${gray["100"]};
    cursor: pointer;
  }
`

const DropdownMenu = styled.ul`
  display: block;
  position: absolute;
  background-color: ${gray["50"]};
  min-width: 100%;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 10rem;
  overflow-y: auto;
  border-radius: 0 0 0.25rem 0.25rem;
`

const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  color: ${gray["0"]};
  font-weight: 600;
  background-color: ${({ isSelected }) => (isSelected ? gray["75"] : null)};

  &:hover {
    cursor: pointer;
    background-color: ${gray["25"]};
  }
`

const Hashtag = styled.span`
  color: ${orange};
  margin-right: 0.25rem;
  font-weight: 600;
`

export default function DropdownMenuComponent({
  type,
  allChannels,
  initialChannelID,
  handleChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(
    allChannels.find((c) =>
      c.id ? c.id === initialChannelID : c.name === "None"
    )
  )
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleChannelSelection = (channel) => {
    setSelectedChannel(channel)
    setIsOpen(false)
    handleChange(channel, type)
  }

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownButton onClick={handleToggle}>
        {selectedChannel.id && <Hashtag>#</Hashtag>}
        {selectedChannel.name}
      </DropdownButton>

      {isOpen && (
        <DropdownMenu>
          {allChannels.map((channel) => (
            <DropdownItem
              key={channel.id || channel.name}
              onClick={() => handleChannelSelection(channel, type)}
              isSelected={
                selectedChannel.id
                  ? selectedChannel.id === channel.id
                  : selectedChannel.name === channel.name
              }
            >
              {channel.id ? <Hashtag>#</Hashtag> : null}
              {channel.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
