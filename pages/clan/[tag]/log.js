import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"
import { BiLinkExternal } from "react-icons/bi"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import styled from "styled-components"

import ClanLogs from "../../../components/Tables/ClanLogs"
import ClanLogsOverview from "../../../components/Tables/ClanLogsOverview"
import useDebouncedCallback from "../../../hooks/useDebouncedCallback"
import useWindowSize from "../../../hooks/useWindowSize"
import { gray, orange, pink } from "../../../public/static/colors"
import { getClanBadgeFileName } from "../../../utils/files"
import { formatTag, getCRErrorUrl, handleSCResponse } from "../../../utils/functions"
import {
  addClan,
  fetchClan,
  fetchLog,
  getUser,
  saveClan,
  unsaveClan,
} from "../../../utils/services"

const Main = styled.div({})

const HeaderDiv = styled.div({
  background: gray["50"],
  // eslint-disable-next-line no-dupe-keys
  background: `linear-gradient(3600deg, ${gray["75"]} 0%, ${gray["50"]} 100%)`,
  padding: "2rem",
  color: gray["0"],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "@media (max-width: 480px)": {
    padding: "1rem",
  },
})

const LeftDiv = styled.div({})

const TopHeaderDiv = styled.div({
  display: "flex",
  alignItems: "center",
})

const BottomHeaderDiv = styled.div({
  display: "flex",
  marginTop: "1rem",
  alignItems: "center",

  "@media (max-width: 480px)": {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
  },
})

const Name = styled.h1({
  fontSize: "2.25rem",

  "@media (max-width: 480px)": {
    fontSize: "1.5rem",
  },
})

const Tag = styled.p({
  color: gray["25"],
})

const Trophy = styled(Image)({
  marginLeft: "1.5rem",
  marginRight: "0.5rem",

  "@media (max-width: 480px)": {
    marginRight: "0.25rem",
  },
})

const WarTrophy = styled(Image)({
  marginLeft: "1.5rem",
  marginRight: "0.5rem",

  "@media (max-width: 480px)": {
    marginRight: "0.25rem",
  },
})

const Badge = styled(Image)({})

const IconDiv = styled.div({
  display: "flex",
  alignItems: "center",
  backgroundColor: gray["75"],
  padding: "0.5rem",
  borderRadius: "0.4rem",
  marginLeft: "0.75rem",

  "@media (max-width: 480px)": {
    padding: "0.4rem",
  },
})

const InGameLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  backgroundColor: gray["75"],
  padding: "0.5rem",
  borderRadius: "0.4rem",
  marginLeft: "0.5rem",

  "@media (max-width: 480px)": {
    padding: "0.4rem",
  },
})

const BookmarkFill = styled(FaBookmark)({
  color: pink,

  ":hover, :active": {
    cursor: "pointer",
  },
})

const Bookmark = styled(FaRegBookmark)({
  color: pink,

  ":hover, :active": {
    cursor: "pointer",
  },
})

const InGameLinkIcon = styled(BiLinkExternal)({
  color: gray["25"],

  ":hover, :active": {
    cursor: "pointer",
    color: orange,
  },
})

const NavDiv = styled.div({
  display: "flex",
})

const NavItem = styled.div({
  color: gray["0"],
  padding: "0.5rem 1rem",

  ":hover, :active": {
    cursor: "pointer",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },
})

export default function ClanLog({ clan, log }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { width } = useWindowSize()
  const [isSaved, setIsSaved] = useState(false)

  const badgeName = getClanBadgeFileName(clan.badgeId, clan.clanWarTrophies)

  useEffect(() => {
    if (session && clan && router) {
      getUser()
        .then((data) => {
          const saved = !!(data?.savedClans || []).find((c) => c.tag === clan.tag)

          setIsSaved(saved)

          return saved
        })
        .catch(() => {})
    }
  }, [session, clan, router])

  useEffect(() => {
    if (clan && badgeName !== "no_clan") addClan(clan.name, clan.tag, badgeName)

    return () => {}
  }, [clan, badgeName])

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
    <>
      <NextSeo
        title={`${clan.name} | Race Log - CWStats`}
        description={clan.description}
        openGraph={{
          title: `${clan.name} | Race Log - CWStats`,
          description: clan.description,
          images: [
            {
              url: `/assets/badges/${getClanBadgeFileName(
                clan.badgeId,
                clan.clanWarTrophies
              )}.png`,
              alt: "Clan Badge",
            },
          ],
        }}
      />

      <Main>
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
                href={`https://link.clashroyale.com/?clanInfo?id=${clan.tag.substring(
                  1
                )}`}
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

        <NavDiv>
          <NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}`)}>
            Home
          </NavItem>
          <NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}/race`)}>
            Race
          </NavItem>
          <NavItem
            style={{
              borderBottom: `3px solid ${pink}`,
            }}
          >
            Log
          </NavItem>
          <NavItem onClick={() => router.push(`/clan/${clan.tag.substring(1)}/stats`)}>
            Stats
          </NavItem>
        </NavDiv>

        <ClanLogsOverview clanTag={clan.tag} log={log} />

        <ClanLogs clanTag={clan.tag} log={log} />
      </Main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { tag } = context.params
  const formattedTag = formatTag(tag, false)

  try {
    const [clanRes, logRes] = await Promise.all([
      fetchClan(formattedTag),
      fetchLog(formattedTag),
    ])
    const [clan, log] = await Promise.all([
      handleSCResponse(clanRes),
      handleSCResponse(logRes),
    ])

    return {
      props: {
        clan,
        log,
      },
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: getCRErrorUrl(err),
      },
      props: {},
    }
  }
}
