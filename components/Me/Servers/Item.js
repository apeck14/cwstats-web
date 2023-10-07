import Image from "next/image"
import { useRouter } from "next/router"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray } from "../../../public/static/colors"

const Main = styled.div`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 6px 12px;

  &:hover {
    box-shadow: none;
    cursor: pointer;
  }
`

const Background = styled.div`
  display: flex;
  background-color: ${gray["100"]};
  padding: 1.5rem 4rem;
  border-radius: 0.5rem 0.5rem 0 0;

  @media (max-width: 480px) {
    padding: 2rem 6rem;
  }
`

const Icon = styled(Image)`
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: ${gray["25"]};
`

const BlankIcon = styled.div`
  height: 80px;
  width: 80px;
  background-color: ${gray["50"]};
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: ${gray["25"]};

  @media (max-width: 480px) {
    height: 90px;
    width: 90px;
  }
`

const Content = styled.div`
  background-color: ${gray["50"]};
  padding: 0.5rem;
  border-radius: 0 0 0.5rem 0.5rem;
`

const Name = styled.p`
  text-align: center;
  color: ${gray["0"]};
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`

export default function Item({ guild }) {
  const router = useRouter()
  const { width } = useWindowSize()

  const iconSize = width > 480 ? 80 : 90

  return (
    <Main onClick={() => router.push(`/me/${guild.id}/abbreviations`)}>
      <Background>
        {guild.icon ? (
          <Icon
            alt={guild.name}
            height={iconSize}
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
            unoptimized
            width={iconSize}
          />
        ) : (
          <BlankIcon />
        )}
      </Background>
      <Content>
        <Name>{guild.name}</Name>
      </Content>
    </Main>
  )
}
