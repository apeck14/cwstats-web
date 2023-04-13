import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import { gray, pink } from "../../../public/static/colors"
import Skeleton from "../../Skeleton"

const Main = styled.div`
  background-color: ${gray["50"]};
  border-radius: 0.25rem;
  padding: 1rem;
  display: flex;
  margin-bottom: 0.25rem;
`

const Badge = styled(Image)``

const InfoDiv = styled.div`
  margin-left: 1rem;
`

const Name = styled(Link)`
  text-decoration: none;
  color: ${gray["0"]};
  font-weight: 700;

  :hover,
  :active {
    color: ${pink};
  }
`

const Tag = styled.p`
  color: ${gray["25"]};
`

export default function SearchItem({ clan, skeleton }) {
  if (skeleton) {
    return (
      <Main>
        <Skeleton height="38.5px" width="28px" />
        <InfoDiv>
          <Skeleton height="1rem" width="10rem" />
          <Skeleton height="1rem" width="5rem" margin="0.25rem 0 0 0" />
        </InfoDiv>
      </Main>
    )
  }

  return (
    <Main>
      <Badge
        src={`/assets/badges/${clan.badge}.png`}
        width={28}
        height={38.5}
        alt="Badge"
      />
      <InfoDiv>
        <Name href={`/clan/${clan.tag.substring(1)}`}>{clan.name}</Name>
        <Tag>{clan.tag}</Tag>
      </InfoDiv>
    </Main>
  )
}
