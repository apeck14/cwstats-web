import Link from "next/dist/client/link"
import Image from "next/image"
import { useState } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import styled from "styled-components"

import useDebouncedCallback from "../../hooks/useDebouncedCallback"
import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange } from "../../public/static/colors"
import {
  saveClan,
  savePlayer,
  unsaveClan,
  unsavePlayer,
} from "../../utils/services"

const ContentItem = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: gray["50"],
  borderRadius: "0.25rem",
  padding: "0.75rem 1rem",
  color: gray["0"],
  marginBottom: "0.25rem",

  "@media (max-width: 768px)": {
    padding: "0.5rem",
  },
})

const IconDiv = styled.div({
  display: "flex",
  alignItems: "center",
})

const LeftDiv = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "45%",
  marginLeft: "1rem",

  "@media (max-width: 480px)": {
    marginLeft: "0.75rem",
  },
})

const RightDiv = styled.div({
  display: "flex",
  justifyContent: "space-evenly",
  width: "55%",
})

const Icon = styled(Image)({})

const Name = styled(Link)({
  textDecoration: "none",
  color: gray["0"],
  fontSize: "1.05rem",

  ":hover, :active": {
    cursor: "pointer",
    color: gray["25"],
  },

  "@media (max-width: 1024px)": {
    fontSize: "0.9rem",
  },

  "@media (max-width: 768px)": {
    fontSize: "0.8rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.75rem",
  },
})

const Tag = styled.p({
  color: gray["25"],
  fontSize: "0.95rem",

  "@media (max-width: 1200px)": {
    fontSize: "0.75rem",
  },
})

const ContentLink = styled(Link)({
  textDecoration: "none",
  color: orange,
  fontSize: "0.95rem",

  ":hover, :active": {
    cursor: "pointer",
    textDecoration: "underline",
  },

  "@media (max-width: 768px)": {
    fontSize: "0.75rem",
  },
})

const BookmarkDiv = styled.div({
  display: "flex",
  justifyContent: "center",

  ":hover, :active": {
    cursor: "pointer",
  },
})

const Bookmark = styled(FaBookmark)({})

const BookmarkFill = styled(FaRegBookmark)({})

export default function SavedItem({ data, links, isPlayer }) {
  const [isSaved, setIsSaved] = useState(true)
  const { width } = useWindowSize()

  const { name, tag, badge } = data

  const updateSavedItem = useDebouncedCallback(() => {
    if (isPlayer) {
      if (isSaved) unsavePlayer(tag)
      else savePlayer(name, tag)
    } else if (isSaved) unsaveClan(tag)
    else saveClan(name, tag, badge)
  }, 1500)

  const toggleSavedItem = () => {
    setIsSaved(!isSaved)
    updateSavedItem()
  }

  const profileIconHeight = width <= 480 ? 27 : 32
  const profileIconWidth = width <= 480 ? 23 : 27
  const clanBadgeHeightPx = width <= 480 ? 27 : 32
  const clanBadgeWidthPx = width <= 480 ? 20.25 : 24

  const iconSrc = isPlayer
    ? "/assets/icons/king-pink.png"
    : `/assets/badges/${badge}.png`

  return (
    <ContentItem>
      <IconDiv>
        <Icon
          src={iconSrc}
          alt="Icon"
          width={isPlayer ? profileIconWidth : clanBadgeWidthPx}
          height={isPlayer ? profileIconHeight : clanBadgeHeightPx}
        />
      </IconDiv>
      <LeftDiv>
        <Name href={`${isPlayer ? "/player" : "/clan"}/${tag.substring(1)}`}>
          {name}
        </Name>
        {width <= 1024 ? null : <Tag>{tag}</Tag>}
      </LeftDiv>
      <RightDiv>
        {links.map((l) => (
          <ContentLink key={tag} href={l.url}>
            {l.name}
          </ContentLink>
        ))}
      </RightDiv>
      <BookmarkDiv onClick={toggleSavedItem}>
        {isSaved ? <Bookmark /> : <BookmarkFill />}
      </BookmarkDiv>
    </ContentItem>
  )
}
