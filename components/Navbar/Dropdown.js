import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"

const Main = styled.div`
  height: 100%;
  position: relative;
`

const DropdownContent = styled.div`
  position: absolute;
  background-color: ${gray["75"]};
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1; //make element come to front

  li {
    padding: 20px;
  }

  a {
    color: ${gray["0"]};
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 600;
  }

  a:hover,
  a:active {
    color: ${pink};
  }
`

const MenuHeader = styled.a`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 0 1.25rem;
  height: 100%;
  color: ${gray["0"]};
  font-weight: 600;

  :hover {
    color: ${pink};
    cursor: pointer;
  }
`

export default function Dropdown({ header, items, icon }) {
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  const handleOnBlur = (e) => {
    if (e?.relatedTarget?.pathname) router.push(e.relatedTarget.pathname)

    setIsActive(false)
  }

  return (
    <Main onBlur={handleOnBlur}>
      <MenuHeader
        className="noselect"
        tabIndex={0}
        onClick={() => setIsActive(!isActive)}
      >
        {icon}
        {header}
        {isActive ? <BiCaretUp /> : <BiCaretDown />}
      </MenuHeader>
      <DropdownContent
        style={
          isActive
            ? {
                borderTop: `1px solid ${pink}`,
              }
            : null
        }
      >
        {items.map((i) => (
          <li
            key={i.title}
            style={{
              display: isActive ? "block" : "none",
            }}
          >
            <Link href={`${i.url}`}>{i.title}</Link>
          </li>
        ))}
      </DropdownContent>
    </Main>
  )
}
