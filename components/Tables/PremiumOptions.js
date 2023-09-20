import styled from "styled-components"

import useWindowSize from "../../hooks/useWindowSize"
import { gray, orange, pink } from "../../public/static/colors"

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 8rem 0;
  table-layout: fixed;

  @media (max-width: 480px) {
    margin: 5rem 0;
  }
`

const THead = styled.thead`
  th:first-child {
    @media (max-width: 1024px) {
      text-align: center;
    }

    @media (max-width: 480px) {
      width: 40%;
      font-size: 1.25rem;
    }
  }
`

const TH = styled.th`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: ${({ align }) => align};
  padding: 2rem 0;
  border-bottom: 2px solid ${gray["50"]};
  color: ${({ color }) => color || gray["0"]};
  background-color: ${({ isPremium }) => isPremium && gray["75"]};
  border-radius: 1rem 1rem 0 0;

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 1rem 0;
  }
`

const TBody = styled.tbody``

const Row = styled.tr`
  height: 3.75rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

const Cell = styled.td`
  background-color: ${({ backgroundColor }) => backgroundColor};
  text-align: ${({ align }) => align || "center"};
  padding: 0 1rem;
  color: ${gray["25"]};
  font-weight: 400;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
`

const Header = styled(Cell)`
  text-align: left;
  padding: 3rem 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${gray["0"]};

  @media (max-width: 1024px) {
    text-align: center;
    padding: 1rem 0;
  }

  @media (max-width: 480px) {
    text-align: center;
    font-size: 1rem;
    padding: 1rem 0;
  }
`

export default function PremiumOptionsTable() {
  const { width } = useWindowSize()
  const isTablet = width <= 1024

  return (
    <Table>
      <THead>
        <TH align="left">FEATURES</TH>
        {!isTablet && <TH color={gray["50"]}>Standard</TH>}
        <TH color={orange}>CWStats+</TH>
        <TH color={pink} isPremium>
          Premium
        </TH>
      </THead>
      <TBody>
        <Row>
          <Header>Discord Bot</Header>
          {!isTablet && <Cell />}
          <Cell />
          <Cell backgroundColor={gray["75"]} />
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Access to all Slash Commands</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">Web Dashboard for configuration</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Automated application system</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">Clan Abbreviations</Cell>
          {!isTablet && <Cell>15</Cell>}
          <Cell>15</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Scheduled Nudges</Cell>
          {!isTablet && <Cell>5</Cell>}
          <Cell>5</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row>
          <Cell align="left">Daily War Reports (missed attacks, daily scores, etc.)</Cell>
          {!isTablet && <Cell>1</Cell>}
          <Cell>1</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Linked Accounts for Nudging</Cell>
          {!isTablet && <Cell>300</Cell>}
          <Cell>300</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row>
          <Header>Clan Analytics</Header>
          {!isTablet && <Cell />}
          <Cell />
          <Cell backgroundColor={gray["75"]} />
        </Row>
        <Row>
          <Cell align="left">Race averages and projected finishes</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Clan record tracking</Cell>
          {!isTablet && <Cell />}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">Global and local daily war leaderboards</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Clan average tracking throughout war day (last 5 seasons)</Cell>
          {!isTablet && <Cell />}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">...more coming soon!</Cell>
          {!isTablet && <Cell />}
          <Cell>🎉</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row>
          <Header>Clan War Tools</Header>
          {!isTablet && <Cell />}
          <Cell />
          <Cell backgroundColor={gray["75"]} />
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Spy - sniping tool to view opponent&apos;s war decks</Cell>
          {!isTablet && <Cell>✅</Cell>}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">...more coming soon!</Cell>
          {!isTablet && <Cell />}
          <Cell>🎉</Cell>
          <Cell backgroundColor={gray["75"]}>🎉</Cell>
        </Row>
        <Row>
          <Header>Other</Header>
          {!isTablet && <Cell />}
          <Cell />
          <Cell backgroundColor={gray["75"]} />
        </Row>
        <Row backgroundColor={gray["90"]}>
          <Cell align="left">Special clan badge on website</Cell>
          {!isTablet && <Cell />}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
        <Row>
          <Cell align="left">Early access to new features</Cell>
          {!isTablet && <Cell />}
          <Cell>✅</Cell>
          <Cell backgroundColor={gray["75"]}>✅</Cell>
        </Row>
      </TBody>
    </Table>
  )
}
