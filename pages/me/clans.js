import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { NextSeo } from "next-seo"
import { useEffect, useState } from "react"
import styled from "styled-components"

import SavedItem from "../../components/Saved/Item"
import { gray, orange, pink } from "../../public/static/colors"

const Main = styled.div({
  width: "60%",
  margin: "0 auto",
  padding: "3rem 0",

  "@media (max-width: 480px)": {
    width: "90%",
  },
})

const Header = styled.h1({
  color: gray["0"],
  fontSize: "3rem",

  "@media (max-width: 1024px)": {
    fontSize: "2.75rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "2rem",
  },
})

const SubHeader = styled.h2({
  color: gray["25"],
  fontSize: "1.1rem",
  fontWeight: 500,

  "@media (max-width: 1024px)": {
    fontSize: "1rem",
  },

  "@media (max-width: 480px)": {
    fontSize: "0.9rem",
  },
})

const ContentDiv = styled.div({
  backgroundColor: gray["75"],
  minHeight: "25rem",
  padding: "1rem",
  margin: "1rem 0",
  borderRadius: "0.25rem",
})

const LoadMoreDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
})

const LoadMore = styled.button({
  padding: "0.5rem",
  backgroundColor: pink,
  border: "none",
  color: gray["0"],
  margin: "auto",
  borderRadius: "1rem",
  fontWeight: 600,

  ":hover, :active": {
    cursor: "pointer",
    backgroundColor: orange,
  },
})

const NoneText = styled.p({
  color: gray["0"],
  fontStyle: "italic",
})

export default function Clans() {
  const { data: session, status } = useSession()
  const [clans, setClans] = useState([])
  const [fetchedOnSession, setFetchedOnSession] = useState(false) // avoid constant calls to DB for session
  const [numShown, setNumShown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    if (session && !fetchedOnSession) {
      fetch(`/api/user`)
        .then((res) => res.json())
        .then((data) => {
          setClans(data.savedClans || [])
          setFetchedOnSession(true)

          return true
        })
        .catch(() => {})
    }
  }, [session, fetchedOnSession])

  if (status === "loading") return null
  if (status === "unauthenticated") {
    router.push("/login")

    return
  }

  return (
    <>
      <NextSeo
        title="My Clans"
        description="View your saved clans on CWStats."
        openGraph={{
          title: "My Clans",
          description: "View your saved clans on CWStats.",
        }}
      />
      <Main>
        <Header>My Clans</Header>
        <SubHeader>View all saved clans.</SubHeader>
        <ContentDiv>
          {clans.length === 0 ? (
            <NoneText>No clans saved!</NoneText>
          ) : (
            clans.slice(0, numShown).map((c, index) => (
              <SavedItem
                key={index}
                name={c.name}
                tag={c.tag}
                badge={c.badge}
                links={[
                  {
                    name: "Race",
                    url: `/clan/${c.tag.substring(1)}/race`,
                  },
                  {
                    name: "Log",
                    url: `/clan/${c.tag.substring(1)}/log`,
                  },
                  {
                    name: "Stats",
                    url: `/clan/${c.tag.substring(1)}/stats`,
                  },
                ]}
              />
            ))
          )}
        </ContentDiv>
        {clans.length > numShown ? (
          <LoadMoreDiv>
            <LoadMore onClick={() => setNumShown(numShown + 10)}>
              Load More...
            </LoadMore>
          </LoadMoreDiv>
        ) : null}
      </Main>
    </>
  )
}
