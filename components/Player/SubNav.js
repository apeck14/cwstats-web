import { useRouter } from "next/router"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"

const NavDiv = styled.div`
  display: flex;
`

const NavItem = styled.div`
  color: ${gray["0"]};
  padding: 0.5rem 1rem;
  border-bottom: ${({ $isActive }) => $isActive && `3px solid ${pink}`};
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
        $isActive={router.asPath === `/player/${router.query.tag}`}
        onClick={() => handleClick(`/player/${router.query.tag}`)}
      >
        Home
      </NavItem>
      <NavItem
        $isActive={router.asPath === `/player/${router.query.tag}/cards`}
        onClick={() => handleClick(`/player/${router.query.tag}/cards`)}
      >
        Cards
      </NavItem>
      <NavItem
        $isActive={router.asPath === `/player/${router.query.tag}/battles`}
        onClick={() => handleClick(`/player/${router.query.tag}/battles`)}
      >
        Battles
      </NavItem>
      <NavItem
        $isActive={router.asPath === `/player/${router.query.tag}/war`}
        onClick={() => handleClick(`/player/${router.query.tag}/war`)}
      >
        War
      </NavItem>
    </NavDiv>
  )
}
