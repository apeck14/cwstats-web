import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import { gray, pink } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import Skeleton from "../../Skeleton"

const Main = styled.div`
  background-color: ${gray["50"]};
  border-radius: 0.25rem;
  padding: 1rem;
  display: flex;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
`

const Icon = styled(Image)``

const InfoDiv = styled.div`
  margin-left: 1rem;
`

const Name = styled(Link)`
  text-decoration: none;
  color: ${gray["0"]};
  font-weight: 700;
  display: flex;
  column-gap: 0.5rem;

  &:hover {
    color: ${pink};
  }
`

const Gray = styled.p`
  color: ${gray["25"]};
`

export default function SearchItem({ isPlayer, item, skeleton }) {
  const clanBadgeWidth = 38 * 0.75
  const kingWidth = 38 * 0.85

  if (skeleton) {
    return (
      <Main>
        <Skeleton height="38.5px" width="28px" />
        <InfoDiv>
          <Skeleton height="1rem" width="10rem" />
          <Skeleton height="1rem" margin="0.25rem 0 0 0" width="5rem" />
        </InfoDiv>
      </Main>
    )
  }

  return (
    <Main>
      <Icon
        alt="Badge"
        height={38}
        src={
          isPlayer
            ? "/assets/icons/king-pink.png"
            : `/assets/badges/${getClanBadgeFileName(
                item.badgeId,
                item.clanWarTrophies
              )}.png`
        }
        width={isPlayer ? kingWidth : clanBadgeWidth}
      />

      <InfoDiv>
        <Name href={`/${isPlayer ? "player" : "clan"}/${item.tag.substring(1)}`}>
          {item.name}
          {isPlayer && <Gray> ({item.tag})</Gray>}
        </Name>
        <Gray>{isPlayer ? item.clanName : item.tag}</Gray>
      </InfoDiv>
    </Main>
  )
}
