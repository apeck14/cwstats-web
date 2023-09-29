import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange } from "../../../public/static/colors"
import Skeleton from "../../Skeleton"

const Main = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;

  @media (max-width: 528px) {
    height: 3rem;
  }
`

const Icon = styled(Image)``

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Row = styled.div`
  display: flex;
  height: 50%;
  justify-content: space-between;
  margin-left: 1rem;
`

const Name = styled(Link)`
  color: ${gray["0"]};
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${gray["25"]};
  }

  @media (max-width: 33rem) {
    font-size: 1rem;
  }
`

const ClanTag = styled.p`
  color: ${gray["25"]};
  font-weight: 600;

  @media (max-width: 33rem) {
    font-size: 0.9rem;
  }
`

const ItemLink = styled(Link)`
  text-decoration: none;
  color: ${orange};

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 30rem) {
    font-size: 0.9rem;
  }
`

export default function SavedItem({ data, isPlayer, skeleton }) {
  const { width } = useWindowSize()

  const iconHeight = width <= 480 ? 32 : 40
  const clanBadgeWidth = iconHeight * 0.75
  const kingWidth = iconHeight * 0.85

  if (skeleton) {
    return (
      <Main>
        <Skeleton height={`${iconHeight}px`} width={`${clanBadgeWidth}px`} />
        <Content>
          <Row style={{ marginBottom: "0.2rem" }}>
            <Skeleton height="1rem" width="30%" />
            <Skeleton height="0.9rem" width="12%" />
          </Row>
          <Row>
            <Skeleton height="0.9rem" width="10%" />
            <Skeleton height="0.9rem" width="10%" />
            <Skeleton height="0.9rem" width="10%" />
          </Row>
        </Content>
      </Main>
    )
  }

  const formattedTag = data.tag.substring(1)

  const links = isPlayer ? ["Battles", "Cards", "War"] : ["Race", "Log", "CWStats+"]

  const urls = isPlayer
    ? [
        `/player/${formattedTag}`,
        `/player/${formattedTag}/battles`,
        `/player/${formattedTag}/cards`,
        `/player/${formattedTag}/war`,
      ]
    : [`/clan/${formattedTag}`, `/clan/${formattedTag}/race`, `/clan/${formattedTag}/log`, `/clan/${formattedTag}/plus`]

  return (
    <Main>
      <Icon
        height={iconHeight}
        src={isPlayer ? "/assets/icons/king-pink.png" : `/assets/badges/${data.badge}.png`}
        width={isPlayer ? kingWidth : clanBadgeWidth}
      />
      <Content>
        <Row>
          <Name href={urls[0]}>{data.name}</Name>
          <ClanTag>{data.tag}</ClanTag>
        </Row>
        <Row>
          <ItemLink href={urls[1]}>{links[0]}</ItemLink>
          <ItemLink href={urls[2]}>{links[1]}</ItemLink>
          <ItemLink href={urls[3]}>{links[2]}</ItemLink>
        </Row>
      </Content>
    </Main>
  )
}
