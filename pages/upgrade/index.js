import { NextSeo } from "next-seo"
import { BiSolidCrown } from "react-icons/bi"
import styled from "styled-components"

import Card from "../../components/Premium/Card"
import PremiumOptionsTable from "../../components/Tables/PremiumOptions"
import { gray, orange, pink } from "../../public/static/colors"

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  gap: 1.5rem;
  text-align: center;
  padding: 0 1rem;

  @media (max-width: 480px) {
    margin-top: 2rem;
  }
`

const Premium = styled.h1`
  font-size: 1.75rem;
  color: ${gray["0"]};
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  border-color: ${orange};
  border-width: 3px;
  border-style: solid;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
    border-width: 2px;
  }
`

const Title = styled.h1`
  color: ${gray["0"]};
  font-size: 2.75rem;

  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
`

const CrownIcon = styled(BiSolidCrown)`
  color: ${pink};
  font-size: 2.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const SubHeader = styled.h4`
  color: ${gray["25"]};
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const Cards = styled.div`
  display: flex;
  columns: 2;
  flex-wrap: wrap;
  margin: 2rem 0;
  gap: 3rem;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`

export default function Upgrade() {
  return (
    <>
      <NextSeo
        description="Enable detailed clan tracking, and other statistics with CWStats+...all for FREE!"
        openGraph={{
          description: "Enable detailed clan tracking, and other statistics with CWStats+...all for FREE!",
          title: "CWStats+",
        }}
        title="CWStats | Upgrade"
      />
      <Header>
        <Premium>
          <CrownIcon />
          UPGRADE
        </Premium>
        <Title>Upgrade your CW2 experience.</Title>
        <SubHeader>
          For nearly two years, CWStats has been a trusted ally for elite war clans, providing essential statistics and
          projections alongside an ad-free experience with no upfront charges. We kindly invite you to express your
          appreciation for our countless hours of dedicated effort by unlocking the complete capabilities of CWStats,
          and elevate your clan family to new heights today.
        </SubHeader>
      </Header>

      <Cards>
        <Card
          color={orange}
          perks={[
            "Clan average tracking throughout war day, up to last 5 seasons",
            "Gurantees clan to be tracked on daily leaderboards",
            "Clan record tracking",
            "Special clan badge on CWStats",
            "& more!",
          ]}
          price="FREE"
          title="CWStats+"
        />
        {/* <Card
          title="Premium"
          price="🎉"
          perks={[
            "All perks from CWStats+",
            "Global clan abbreviation",
            "Daily player performance tracking",
            "Real-time player battle logs, and advanced battle statistics",
            "Increased bot limits",
            "& more!",
          ]}
          color={pink}
        /> */}
        <Card
          color={pink}
          perks={["All perks from CWStats+", "Game-changing features soon 👀🤫", "& more!"]}
          price="🎉"
          title="Premium"
        />
      </Cards>
      <PremiumOptionsTable />
    </>
  )
}
