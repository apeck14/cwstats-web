import { useRouter } from "next/router"
import { useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import styled from "styled-components"

import useToggleBodyScroll from "../../hooks/useToggleBodyScroll"
import { gray } from "../../public/static/colors"

const Main = styled.div({
  backgroundColor: "rgba(0,0,0,0.6)",
  height: "100%",
  left: 0,
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: "1",
})

const Modal = styled.div({
  "@media (max-width: 1024px)": {
    margin: "15% auto",
    width: "80%",
  },
  "@media (max-width: 480px)": {
    margin: "25% auto",
    width: "90%",
  },
  backgroundColor: gray["50"],
  borderRadius: "1rem",

  margin: "10% auto",

  width: "50%",
})

const SearchDiv = styled.div({
  alignItems: "center",
  display: "flex",
  padding: "1rem",
})

const SearchBar = styled.input({
  backgroundColor: gray["50"],
  color: gray["0"],
  fontSize: "1.2rem",
  height: "2rem",
  width: "100%",
})

const SearchIcon = styled(BiSearchAlt)({
  color: gray["0"],
  fontSize: "1.4rem",
})

const ContentDiv = styled.div({
  maxHeight: "20rem",
  overflow: "auto",
  paddingBottom: "1rem",
})

const Option = styled.p({
  "&:hover": {
    backgroundColor: gray["75"],
    cursor: "pointer",
  },
  color: gray["0"],

  padding: "0.5rem 1rem",
})

export default function LocationsModal({ isOpen, setIsModalOpen, locations }) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  useToggleBodyScroll(!isOpen)

  return isOpen ? (
    <Main onClick={() => setIsModalOpen(false)}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <SearchDiv>
          <SearchBar placeholder="Search locations..." onChange={(e) => setSearch(e.target.value)} />
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
