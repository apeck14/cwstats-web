import Image from "next/image"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray } from "../../../public/static/colors"
import SubNav from "./SubNav"

const Main = styled.div`
  margin: 2.5rem 0 1rem 0;
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`

const Icon = styled(Image)`
  border-radius: 50%;
  outline: 2px solid ${gray["25"]};
`

const DefaultIcon = styled.div`
  border-radius: 50%;
  outline: 2px solid ${gray["25"]};
  background-color: ${gray["50"]};
  height: 60px;
  width: 60px;

  @media (max-width: 480px) {
    height: 50px;
    width: 50px;
  }
`

const Name = styled.h1`
  color: ${gray["0"]};
  margin-left: 1.5rem;
  font-size: 3rem;

  @media (max-width: 480px) {
    margin-left: 1rem;
    font-size: 2rem;
  }
`

const SubHeader = styled.h2`
  font-size: 1.25rem;
  color: ${gray["25"]};

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`

export default function ServerHeader({ name, icon, id }) {
  const { width } = useWindowSize()

  const iconPx = width > 480 ? 60 : 50

  return (
    <>
      <Main>
        {icon ? (
          <Icon
            src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp`}
            alt={name}
            height={iconPx}
            width={iconPx}
          />
        ) : (
          <DefaultIcon />
        )}
        <Name>{name}</Name>
      </Main>
      <SubHeader>
        Customize CW2 Stats Discord bot settings for your server!
      </SubHeader>
      <SubNav />
    </>
  )
}
