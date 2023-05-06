import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { gray, pink } from "../../../../../public/static/colors"

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  min-width: 12rem;
`

const DropdownButton = styled.button`
  background-color: ${gray["50"]};
  color: ${gray["0"]};
  border: none;
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  min-width: 100%;
  border-radius: 0.5rem 0.5rem 0 0;
  font-weight: 600;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.2);

  :hover {
    background-color: ${pink};
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
`

const DropdownItem = styled.li`
  padding: 0.75rem 1rem;
  color: ${gray["0"]};

  &:hover {
    cursor: pointer;
    background-color: ${gray["25"]};
  }
`

export default function DropdownMenuComponent({ allChannels }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)
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
  }

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownButton onClick={handleToggle}>
        {selectedChannel ? selectedChannel.name : "None"}
      </DropdownButton>

      {isOpen && (
        <DropdownMenu>
          {allChannels.map((channel) => (
            <DropdownItem
              key={channel.id}
              onClick={() => handleChannelSelection(channel)}
            >
              {channel.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
