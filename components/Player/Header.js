import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { BiLinkExternal } from "react-icons/bi"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import styled from "styled-components"

import useDebouncedCallback from "../../hooks/useDebouncedCallback"
import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange, pink } from "../../public/static/colors"
import { savePlayer, unsavePlayer } from "../../utils/services"

const HeaderDiv = styled.div`
  background: ${gray["75"]};
  background: linear-gradient(3600deg, ${gray["50"]} 0%, ${gray["75"]} 100%);
  padding: 2rem;
  color: ${gray["0"]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 0.25rem 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${({ $gap }) => $gap || "1rem"};
`

const Group = styled(Row)`
  column-gap: 0.5rem;

  @media (max-width: 480px) {
    column-gap: 0.35rem;
  }
`

const Name = styled.h1`
  font-size: 2.25rem;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`

const ClanBadge = styled(Image)``

const ClanName = styled.p`
  color: ${gray["0"]};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  &:hover {
    color: ${({ $isClan }) => $isClan && pink};
    cursor: ${({ $isClan }) => $isClan && "pointer"};
  }
`

const Divider = styled.p`
  color: ${gray["50"]};
  font-weight: 900;
  margin: 0 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const Role = styled.p`
  color: ${gray["25"]};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const Tag = styled(Role)``

const Icon = styled(Image)``

const Text = styled.p`
  color: ${gray["0"]};
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: ${gray["75"]};
  padding: 0.5rem;
  border-radius: 0.4rem;
  margin-left: 0.25rem;

  @media (max-width: 480px) {
    padding: 0.4rem;
    margin-left: 0rem;
  }
`

const InGameLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: ${gray["75"]};
  padding: 0.5rem;
  border-radius: 0.4rem;

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
`

const BookmarkFill = styled(FaBookmark)`
  color: ${pink};

  &:hover {
    cursor: pointer;
  }
`

const Bookmark = styled(FaRegBookmark)`
  color: ${pink};

  &:hover {
    cursor: pointer;
  }
`

const InGameLinkIcon = styled(BiLinkExternal)`
  color: ${gray["25"]};

  &:hover {
    cursor: pointer;
    color: ${orange};
  }
`

const Arena = styled(Image)``

export default function PlayerHeader({ arenaName, player, saved }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const { status } = useSession()
  const [isSaved, setIsSaved] = useState(saved)

  const updateSavedItem = useDebouncedCallback(() => {
    if (isSaved) unsavePlayer(player.tag)
    else savePlayer(player.name, player.tag)
  }, 1500)

  const toggleSavedItem = () => {
    if (status === "authenticated") {
      updateSavedItem()
      setIsSaved(!isSaved)
    } else router.push(`/login?callback=${router.asPath}`)
  }

  const handleClanClick = (tag) => router.push(`/clan/${tag}`)

  const inClan = !!player?.clan?.name

  const arenaPx = width <= 480 ? 70 : 100
  const iconPx = width <= 480 ? 15 : 18

  return (
    <HeaderDiv>
      <LeftDiv>
        <Row $gap="0.5rem">
          <Name>{player.name}</Name>
          <IconDiv>
            {isSaved ? <BookmarkFill onClick={toggleSavedItem} /> : <Bookmark onClick={toggleSavedItem} />}
          </IconDiv>
          <InGameLink
            href={`https://link.clashroyale.com/?playerInfo?id=${player.tag.substring(1)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <InGameLinkIcon />
          </InGameLink>
        </Row>
        <Row>
          <Tag>{player.tag}</Tag>
          <Group>
            <Icon alt="Clash Royale Ladder Trophy" height={iconPx} src="/assets/icons/trophy.png" width={iconPx} />
            <Text>
              {player.trophies} / {player.bestTrophies}
            </Text>
          </Group>
          {player.currentPathOfLegendSeasonResult.leagueNumber === 10 && (
            <Group>
              <Icon
                alt="Clash Royale Path of Legends Trophy"
                height={iconPx}
                src="/assets/icons/pol-medals.png"
                width={iconPx}
              />
              <Text>{player.currentPathOfLegendSeasonResult.trophies}</Text>
            </Group>
          )}
        </Row>
        <Group>
          <ClanBadge
            height={width <= 480 ? 23 : 27}
            src={`/assets/badges/${player.clan.badge}.png`}
            unoptimized
            width={width <= 480 ? 18 : 21}
          />
          <ClanName $isClan={inClan} onClick={inClan ? () => handleClanClick(player?.clan?.tag.substring(1)) : null}>
            {player.clan?.name || "None"}
          </ClanName>
          {inClan && (
            <>
              <Divider>|</Divider>
              <Role>{player.role}</Role>
            </>
          )}
        </Group>
      </LeftDiv>
      <Arena height={arenaPx} src={`/assets/arenas/${arenaName}.png`} width={arenaPx} />
    </HeaderDiv>
  )
}
