import { signOut } from "next-auth/react"
import styled from "styled-components"

import { gray, orange, pink } from "../../public/static/colors"

const SignOutBtn = styled.button`
  background-color: ${pink};
  color: ${gray["0"]};
  border-radius: 0.25rem;
  border-width: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    cursor: pointer;
    background-color: ${orange};
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`

export default function SignOut() {
  return (
    <SignOutBtn
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      Log Out
    </SignOutBtn>
  )
}
