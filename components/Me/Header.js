import Image from "next/image"
import { useSession } from "next-auth/react"
import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, pink } from "../../public/static/colors"

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2.5rem 0;

  @media (max-width: 1024px) {
    margin: 1.5rem 0;
    padding: 0 2rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`

const HeaderDiv = styled.div``

const ProfileDiv = styled.div`
  margin-left: 1rem;
`

const Header = styled.h1`
  color: ${gray["0"]};
  font-size: 3rem;

  @media (max-width: 1024px) {
    font-size: 2.75rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

const SubHeader = styled.h2`
  color: ${gray["25"]};
  font-size: 1.1rem;
  font-weight: 500;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const ProfilePicture = styled(Image)`
  border-radius: 50%;
  border-width: 0.125rem;
  border-color: ${pink};
  border-style: solid;
`

const ProfileUsername = styled.p`
  color: ${gray["25"]};
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

export default function MeHeader({ description, title }) {
  const { data: session } = useSession()
  const { width } = useWindowSize()

  const defaultImage = "https://imgur.com/a/aQ3wFBL"
  const profilePicSize = width > 480 ? 65 : 50

  return (
    <Main>
      <HeaderDiv>
        <Header>{title}</Header>

        <SubHeader>{description}</SubHeader>
      </HeaderDiv>

      <ProfileDiv>
        <ProfilePicture
          alt="Discord Profile"
          height={profilePicSize}
          src={session?.user?.image || defaultImage}
          width={profilePicSize}
        />
        <ProfileUsername>{session?.user?.name || "N/A"}</ProfileUsername>
      </ProfileDiv>
    </Main>
  )
}
