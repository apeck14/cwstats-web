import { Container } from "@mantine/core"

import SideBar from "../../components/docs/side-bar"

export default function DocsLayout({ children }) {
  return (
    <>
      <SideBar />
      <Container pb="5rem" pt="xl" size="md">
        {children}
      </Container>
    </>
  )
}
