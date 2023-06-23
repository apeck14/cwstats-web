import { useEffect, useRef, useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri"
import styled from "styled-components"

import { gray, orange } from "../../../../../public/static/colors"

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  width: ${({ isChannels }) => (isChannels ? "12rem" : "5.5rem")};
`

const DropdownButton = styled.button`
  background-color: ${gray["75"]};
  color: ${gray["25"]};
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  min-width: 100%;
  font-weight: 600;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

const Arrow = styled(RiArrowDropDownLine)``

export default function DropdownMenuComponent({
  isChannels,
  values,
  currentItem,
  setCurrentItem,
}) {
  const [isOpen, setIsOpen] = useState(false)
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

  const handleSelection = (item) => {
    setIsOpen(false)
    setCurrentItem(item)
  }

  return (
    <Dropdown ref={dropdownRef} isChannels={isChannels}>
      <DropdownButton onClick={handleToggle}>
        <div>
          {isChannels && values.length > 0 && <Hashtag>#</Hashtag>}
          {isChannels
            ? values.length === 0
              ? "No Channels"
              : currentItem?.name
            : currentItem}
        </div>
        <Arrow />
      </DropdownButton>

      {isOpen && (
        <DropdownMenu>
          {values.map((item) => (
            <DropdownItem
              key={item.id}
              isSelected={false}
              onClick={() => handleSelection(item)}
            >
              {isChannels && <Hashtag>#</Hashtag>}
              {isChannels ? item.name : item}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
