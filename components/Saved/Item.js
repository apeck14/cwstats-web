import Link from "next/dist/client/link"
import Image from "next/image"
import { useState } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import styled from "styled-components"

import useDebouncedCallback from "../../hooks/useDebouncedCallback"
import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange } from "../../public/static/colors"
import { saveClan, savePlayer, unsaveClan, unsavePlayer } from "../../utils/services"

const ContentItem = styled.div({
  "@media (max-width: 768px)": {
    padding: "0.5rem",
  },
  alignItems: "center",
  backgroundColor: gray["50"],
  borderRadius: "0.25rem",
  color: gray["0"],
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.25rem",

  padding: "0.75rem 1rem",
})

const IconDiv = styled.div({
  alignItems: "center",
  display: "flex",
})

const LeftDiv = styled.div({
  "@media (max-width: 480px)": {
    marginLeft: "0.75rem",
  },
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginLeft: "1rem",

  width: "45%",
})

const RightDiv = styled.div({
  display: "flex",
  justifyContent: "space-evenly",
  width: "55%",
})

const Icon = styled(Image)({})

const Name = styled(Link)({
  "@media (max-width: 1024px)": {
    fontSize: "0.9rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "0.75rem",
  },
  "@media (max-width: 768px)": {
    fontSize: "0.8rem",
  },

  "&:hover": {
    color: gray["25"],
    cursor: "pointer",
  },

  color: gray["0"],

  fontSize: "1.05rem",

  textDecoration: "none",
})

const Tag = styled.p({
  "@media (max-width: 1200px)": {
    fontSize: "0.75rem",
  },
  color: gray["25"],

  fontSize: "0.95rem",
})

const ContentLink = styled(Link)({
  "@media (max-width: 768px)": {
    fontSize: "0.75rem",
  },
  "&:hover": {
    cursor: "pointer",
    textDecoration: "underline",
  },
  color: orange,

  fontSize: "0.95rem",

  textDecoration: "none",
})

const BookmarkDiv = styled.div({
  "&:hover": {
    cursor: "pointer",
  },
  display: "flex",

  justifyContent: "center",
})

const Bookmark = styled(FaBookmark)({})

const BookmarkFill = styled(FaRegBookmark)({})

export default function SavedItem({ data, isPlayer, links }) {
  const [isSaved, setIsSaved] = useState(true)
  const { width } = useWindowSize()

  const { badge, name, tag } = data

  const updateSavedItem = useDebouncedCallback(() => {
    if (isPlayer) {
      if (isSaved) unsavePlayer(tag)
      else savePlayer(name, tag)
    } else if (isSaved) unsaveClan(tag)
    else saveClan(name, tag, badge)
  }, 1000)

  const toggleSavedItem = () => {
    setIsSaved(!isSaved)
    updateSavedItem()
  }

  const profileIconHeight = width <= 480 ? 27 : 32
  const profileIconWidth = width <= 480 ? 23 : 27
  const clanBadgeHeightPx = width <= 480 ? 27 : 32
  const clanBadgeWidthPx = width <= 480 ? 20.25 : 24

  const iconSrc = isPlayer ? "/assets/icons/king-pink.png" : `/assets/badges/${badge}.png`

  return (
    <ContentItem>
      <IconDiv>
        <Icon
          alt="Icon"
          height={isPlayer ? profileIconHeight : clanBadgeHeightPx}
          src={iconSrc}
          unoptimized={!isPlayer}
          width={isPlayer ? profileIconWidth : clanBadgeWidthPx}
        />
      </IconDiv>
      <LeftDiv>
        <Name href={`${isPlayer ? "/player" : "/clan"}/${tag.substring(1)}`}>{name}</Name>
        {width <= 1024 ? null : <Tag>{tag}</Tag>}
      </LeftDiv>
      <RightDiv>
        {links.map((l) => (
          <ContentLink href={l.url} key={tag}>
            {l.name}
          </ContentLink>
        ))}
      </RightDiv>
      <BookmarkDiv onClick={toggleSavedItem}>{isSaved ? <Bookmark /> : <BookmarkFill />}</BookmarkDiv>
    </ContentItem>
  )
}
