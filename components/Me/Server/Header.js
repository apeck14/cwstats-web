import Image from "next/image"
import styled from "styled-components"

import useWindowSize from "../../../hooks/useWindowSize"
import { gray } from "../../../public/static/colors"

const Main = styled.div`
  margin: 2.5rem 0 1rem 0;
  display: flex;
  align-items: center;
`

const Icon = styled(Image)`
  border-radius: 50%;
  outline: 3px solid ${gray["25"]};
`

const Name = styled.h1`
  color: ${gray["0"]};
  margin-left: 1.5rem;
  font-size: 3rem;
`

export default function ServerHeader({ name, icon, id }) {
  const { width } = useWindowSize()

  const iconSize = width > 480 ? 60 : 80

  return (
    <Main>
      <Icon
        src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp`}
        alt={name}
        height={iconSize}
        width={iconSize}
      />
      <Name>{name}</Name>
    </Main>
  )
}
