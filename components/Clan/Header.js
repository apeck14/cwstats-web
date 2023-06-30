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
import { saveClan, unsaveClan } from "../../utils/services"

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

const LeftDiv = styled.div``

const TopHeaderDiv = styled.div`
  display: flex;
  align-items: center;
`

const BottomHeaderDiv = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
  font-weight: 600;

  @media (max-width: 480px) {
    margin-top: 0.5rem;
    font-size: 0.75rem;
  }
`

const Name = styled.h1`
  font-size: 2.25rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const Tag = styled.p`
  color: ${gray["25"]};
  font-weight: 600;
`

const Trophy = styled(Image)`
  margin-left: 1.5rem;
  margin-right: 0.5rem;

  @media (max-width: 480px) {
    margin-right: 0.25rem;
  }
`

const WarTrophy = styled(Image)`
  margin-left: 1.5rem;
  margin-right: 0.5rem;

  @media (max-width: 480px) {
    margin-right: 0.25rem;
  }
`

const Badge = styled(Image)``

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: ${gray["75"]};
  padding: 0.5rem;
  border-radius: 0.4rem;
  margin-left: 0.75rem;

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
`

const InGameLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: ${gray["75"]};
  padding: 0.5rem;
  border-radius: 0.4rem;
  margin-left: 0.5rem;

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
`

const BookmarkFill = styled(FaBookmark)`
  color: ${pink};

  &:hover,
  &:active {
    cursor: pointer;
  }
`

const Bookmark = styled(FaRegBookmark)`
  color: ${pink};

  &:hover,
  &:active {
    cursor: pointer;
  }
`

const InGameLinkIcon = styled(BiLinkExternal)`
  color: ${gray["25"]};

  &:hover,
  &:active {
    cursor: pointer;
    color: ${orange};
  }
`

export default function ClanHeader({ saved, badgeName, clan }) {
  const router = useRouter()
  const { width } = useWindowSize()
  const { status } = useSession()
  const [isSaved, setIsSaved] = useState(saved)

  const updateSavedItem = useDebouncedCallback(() => {
    if (isSaved) unsaveClan(clan.tag)
    else saveClan(clan.name, clan.tag, badgeName)
  }, 1500)

  const toggleSavedItem = () => {
    if (status === "authenticated") {
      updateSavedItem()
      setIsSaved(!isSaved)
    } else router.push(`/login?callback=${router.asPath}`)
  }

  const badgeHeightPx = width <= 480 ? 44 : 66
  const badgeWidthPx = width <= 480 ? 32 : 48

  const iconPx = width <= 480 ? 16 : 20

  return (
    <HeaderDiv>
      <LeftDiv>
        <TopHeaderDiv>
          <Name>{clan.name}</Name>
          <IconDiv>
            {isSaved ? (
              <BookmarkFill onClick={toggleSavedItem} />
            ) : (
              <Bookmark onClick={toggleSavedItem} />
            )}
          </IconDiv>
          <InGameLink
            href={`https://link.clashroyale.com/?clanInfo?id=${clan.tag.substring(1)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InGameLinkIcon />
          </InGameLink>
        </TopHeaderDiv>

        <BottomHeaderDiv>
          <Tag>{clan.tag}</Tag>
          <Trophy
            src="/assets/icons/trophy.png"
            height={iconPx}
            width={iconPx}
            alt="Trophy"
          />
          {clan.clanScore}
          <WarTrophy
            src="/assets/icons/cw-trophy.png"
            height={iconPx}
            width={iconPx}
            alt="War Trophy"
          />
          {clan.clanWarTrophies}
        </BottomHeaderDiv>
      </LeftDiv>

      <Badge
        src={`/assets/badges/${badgeName}.png`}
        height={badgeHeightPx}
        width={badgeWidthPx}
        alt="Badge"
      />
    </HeaderDiv>
  )
}
