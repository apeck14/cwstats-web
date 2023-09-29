import Image from "next/image"
import { useRouter } from "next/router"
import styled from "styled-components"

import { gray, pink } from "../../public/static/colors"

const Main = styled.div`
  background-color: ${gray["75"]};
  flex: 1;
  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 20rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  min-height: 25rem;
  position: relative;

  border: ${({ $isPremium }) => $isPremium && `4px solid ${pink}`};
`

const Title = styled.h1`
  color: ${gray["0"]};
  text-align: center;
  font-size: 2.5rem;
`

const Price = styled.h1`
  color: ${({ $color }) => $color};
  text-align: center;
`

const Perks = styled.div`
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: ${gray["0"]};
`

const PerksTitle = styled.p`
  color: ${gray["25"]};
  font-weight: 700;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`

const PerkName = styled.p``

const Checkmark = styled(Image)``

const Confirm = styled.button`
  width: calc(100% - 3rem);
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: 0.75s;
  outline: ${({ $color }) => `${$color} solid 2px`};
  color: ${gray["0"]};
  font-weight: 600;
  font-size: 1rem;
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;

  &:hover {
    cursor: pointer;
    background-color: ${({ $color }) => $color};
  }
`

export default function Card({ color, perks, price, title }) {
  const router = useRouter()
  const isPremium = title === "Premium"

  const handleClick = () => {
    router.push("/upgrade/plus")
  }

  return (
    <Main $isPremium={isPremium}>
      <Title>{title}</Title>
      <Price $color={color}>{price}</Price>
      <PerksTitle>Perks:</PerksTitle>
      <Perks>
        {perks.map((p) => (
          <Item key={p}>
            <Checkmark height={20} src="/assets/icons/checkmark.png" width={20} />
            <PerkName>{p}</PerkName>
          </Item>
        ))}
      </Perks>
      <Confirm $color={color} onClick={handleClick}>
        {isPremium ? `Coming Soon 🎉` : `Activate ${title}`}
      </Confirm>
    </Main>
  )
}
