import { FaDiscord, FaHeart } from "react-icons/fa"
import styled from "styled-components"

import { discordPrimary, gray, orange, pink, silver } from "../public/static/colors"

const Main = styled.div({
  backgroundColor: gray["75"],
  padding: "3rem 0rem",
  fontWeight: 300,
  marginTop: "auto",
})

const TopDiv = styled.div({
  display: "flex",
  justifyContent: "center",
})

const BottomDiv = styled.div({
  justifyContent: "left",
  width: "60%",
  margin: "0 auto",

  "@media (max-width: 1024px)": {
    width: "90%",
  },
})

const IconButton = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  borderWidth: "0",
  backgroundColor: discordPrimary,
  padding: "0.4rem",

  ":hover, :active": {
    cursor: "pointer",
    opacity: "0.8",
  },
})

const DiscordIcon = styled(FaDiscord)({
  fontSize: "1.5rem",
  color: gray["0"],
})

const DonateButton = styled.button({
  borderWidth: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0rem 1rem",
  borderRadius: "1.5rem",
  marginLeft: "1rem",
  backgroundColor: pink,
  color: gray["0"],
  fontSize: "0.9rem",
  fontFamily: "inherit",

  ":hover, :active": {
    cursor: "pointer",
    backgroundColor: orange,
  },
})

const HeartIcon = styled(FaHeart)({
  marginRight: "0.4rem",
})

const Hr = styled.hr({
  borderWidth: "1px",
  borderColor: gray["50"],
  borderStyle: "solid",
  margin: "1.75rem auto",
  width: "60%",

  "@media (max-width: 1024px)": {
    width: "90%",
    margin: "1rem auto",
  },
})

const ContentPolicy = styled.p({
  color: silver,
  fontFamily: "inherit",
  fontSize: "0.85rem",
  display: "inline-flex",
  alignItems: "center",

  "@media (max-width: 480px)": {
    fontSize: "0.65rem",
  },
})

const Copyright = styled.p({
  color: gray["25"],
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  marginTop: "0.4rem",

  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
  },
})

export default function Footer() {
  const discordHandleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open("https://discord.gg/fFY3cnMmnH", "_blank")
  }

  const paypalHandleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open("https://paypal.me/cw2stats", "_blank")
  }

  return (
    <Main>
      <TopDiv>
        <IconButton aria-label="Join Discord Support Server" onClick={discordHandleClick}>
          <DiscordIcon />
        </IconButton>
        <DonateButton aria-label="Donate to CWStats" onClick={paypalHandleClick}>
          <HeartIcon />
          Donate
        </DonateButton>
      </TopDiv>
      <Hr />
      <BottomDiv>
        <ContentPolicy>
          This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell
          is not responsible for it. For more information see Supercell’s Fan Content Policy.
        </ContentPolicy>
        <Copyright>©2023 CWStats. All rights reserved.</Copyright>
      </BottomDiv>
    </Main>
  )
}
