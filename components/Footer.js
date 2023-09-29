import { FaDiscord, FaHeart } from "react-icons/fa"
import styled from "styled-components"

import { discordPrimary, gray, orange, pink, silver } from "../public/static/colors"

const Main = styled.div({
  backgroundColor: gray["75"],
  fontWeight: 300,
  marginTop: "auto",
  padding: "3rem 0rem",
})

const TopDiv = styled.div({
  display: "flex",
  justifyContent: "center",
})

const BottomDiv = styled.div({
  "@media (max-width: 1024px)": {
    width: "90%",
  },
  justifyContent: "left",
  margin: "0 auto",

  width: "60%",
})

const IconButton = styled.button({
  "&:hover": {
    cursor: "pointer",
    opacity: "0.8",
  },
  alignItems: "center",
  backgroundColor: discordPrimary,
  borderRadius: "50%",
  borderWidth: "0",
  display: "flex",
  justifyContent: "center",

  padding: "0.4rem",
})

const DiscordIcon = styled(FaDiscord)({
  color: gray["0"],
  fontSize: "1.5rem",
})

const DonateButton = styled.button({
  "&:hover": {
    backgroundColor: orange,
    cursor: "pointer",
  },
  alignItems: "center",
  backgroundColor: pink,
  borderRadius: "1.5rem",
  borderWidth: "0",
  color: gray["0"],
  display: "flex",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  justifyContent: "center",
  marginLeft: "1rem",

  padding: "0rem 1rem",
})

const HeartIcon = styled(FaHeart)({
  marginRight: "0.4rem",
})

const Hr = styled.hr({
  "@media (max-width: 1024px)": {
    margin: "1rem auto",
    width: "90%",
  },
  borderColor: gray["50"],
  borderStyle: "solid",
  borderWidth: "1px",
  margin: "1.75rem auto",

  width: "60%",
})

const ContentPolicy = styled.p({
  "@media (max-width: 480px)": {
    fontSize: "0.65rem",
  },
  alignItems: "center",
  color: silver,
  display: "inline-flex",
  fontFamily: "inherit",

  fontSize: "0.85rem",
})

const Copyright = styled.p({
  "@media (max-width: 480px)": {
    fontSize: "0.7rem",
  },
  alignItems: "center",
  color: gray["25"],
  display: "flex",
  fontSize: "0.9rem",

  marginTop: "0.4rem",
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
