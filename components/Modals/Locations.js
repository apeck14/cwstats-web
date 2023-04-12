import { useRouter } from "next/router"
import { useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useToggleBodyScroll from "../../hooks/useToggleBodyScroll"
import { gray } from "../../public/static/colors"

const Main = styled.div({
  position: "fixed",
  zIndex: "1",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
})

const Modal = styled.div({
  backgroundColor: gray["50"],
  margin: "10% auto",
  width: "50%",
  borderRadius: "1rem",

  "@media (max-width: 1024px)": {
    width: "80%",
    margin: "15% auto",
  },

  "@media (max-width: 480px)": {
    width: "90%",
    margin: "25% auto",
  },
})

const SearchDiv = styled.div({
  display: "flex",
  alignItems: "center",
  padding: "1rem",
})

const SearchBar = styled.input({
  width: "100%",
  height: "2rem",
  backgroundColor: gray["50"],
  fontSize: "1.2rem",
  color: gray["0"],
})

const SearchIcon = styled(BiSearchAlt)({
  fontSize: "1.4rem",
  color: gray["0"],
})

const ContentDiv = styled.div({
  paddingBottom: "1rem",
  maxHeight: "20rem",
  overflow: "auto",
})

const Option = styled.p({
  color: gray["0"],
  padding: "0.5rem 1rem",

  ":hover, :active": {
    backgroundColor: gray["75"],
    cursor: "pointer",
  },
})

export default function LocationsModal({ isOpen, setIsModalOpen, locations }) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  useToggleBodyScroll(!isOpen)

  return isOpen ? (
    <Main onClick={() => setIsModalOpen(false)}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <SearchDiv>
          <SearchBar
            placeholder="Search locations..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon />
        </SearchDiv>
        <ContentDiv>
          {locations
            .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
            .map((l) => (
              <Option key={l.name} onClick={() => router.push(l.url)}>
                {l.name}
              </Option>
            ))}
        </ContentDiv>
      </Modal>
    </Main>
  ) : null
}
