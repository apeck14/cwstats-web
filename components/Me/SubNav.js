import { useRouter } from "next/router"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"
import SignOut from "./SignOutButton"

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    padding-right: 2rem;
  }

  @media (max-width: 768px) {
    padding-right: 1rem;
  }
`

const Tabs = styled.div`
  display: flex;
  column-gap: 0.5rem;
`

const Item = styled.div`
  padding: 0.5rem 1rem;
  border-bottom-width: ${({ $isActive }) => ($isActive ? "2px" : 0)};
  border-bottom-color: ${({ $isActive }) => ($isActive ? pink : null)};
  border-bottom-style: solid;

  &:hover {
    cursor: pointer;
    border-bottom-width: 2px;
    border-bottom-color: ${pink};
  }
`

const Text = styled.h3`
  color: ${gray["0"]};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

export default function SubNav() {
  const router = useRouter()

  const handleClick = (url) => {
    if (router.asPath === url) return
    router.push(url)
  }

  return (
    <Main>
      <Tabs>
        <Item $isActive={router.asPath === "/me"} onClick={() => handleClick("/me")}>
          <Text>Servers</Text>
        </Item>
        <Item $isActive={router.asPath === "/me/clans"} onClick={() => handleClick("/me/clans")}>
          <Text>Clans</Text>
        </Item>
        <Item $isActive={router.asPath === "/me/players"} onClick={() => handleClick("/me/players")}>
          <Text>Players</Text>
        </Item>
      </Tabs>
      <SignOut />
    </Main>
  )
}
