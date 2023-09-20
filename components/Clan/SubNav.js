import { useRouter } from "next/router"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"

const NavDiv = styled.div`
  display: flex;
  column-gap: 0.5rem;
`

const NavItem = styled.div`
  color: ${gray["0"]};
  padding: 0.5rem 0.75rem;
  border-bottom: ${({ isActive }) => isActive && `3px solid ${pink}`};
  font-weight: 600;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`

export default function SubNav() {
  const router = useRouter()

  const handleClick = (url) => {
    if (url !== router.asPath) {
      router.push(url)
    }
  }

  return (
    <NavDiv className="noselect">
      <NavItem
        isActive={router.asPath === `/clan/${router.query.tag}`}
        onClick={() => handleClick(`/clan/${router.query.tag}`)}
      >
        Home
      </NavItem>
      <NavItem
        isActive={router.asPath === `/clan/${router.query.tag}/race`}
        onClick={() => handleClick(`/clan/${router.query.tag}/race`)}
      >
        Race
      </NavItem>
      <NavItem
        isActive={router.asPath === `/clan/${router.query.tag}/log`}
        onClick={() => handleClick(`/clan/${router.query.tag}/log`)}
      >
        Log
      </NavItem>
      <NavItem
        isActive={router.asPath === `/clan/${router.query.tag}/plus`}
        onClick={() => handleClick(`/clan/${router.query.tag}/plus`)}
      >
        CWStats+
      </NavItem>
    </NavDiv>
  )
}
