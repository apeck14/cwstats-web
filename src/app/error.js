"use client"

import { Button, Container, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLogger } from "next-axiom"
import { useRouter } from "next-nprogress-bar"
import { useEffect } from "react"

export default function Error({ error, reset }) {
  const log = useLogger()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 30em)")
  const pathname = usePathname()

  const isHomePage = pathname === "/"

  const handleClick = () => {
    if (isHomePage) reset()
    else router.push("/")
  }

  useEffect(() => {
    log.error("Error", error)
  }, [error])

  return (
    <Container mt="15%" size="sm" ta="center">
      <Title c="pink.6" fw={900} fz={isMobile ? "3.5rem" : "5rem"}>
        500
      </Title>
      <Title c="gray.1" fw={800} fz={isMobile ? "1.5rem" : "2rem"}>
        Unexpected error.
      </Title>
      <Text c="gray.2" fw={600} fz={isMobile ? "1.2rem" : "1.5rem"} mt="sm">
        If this issue persists, please join the{" "}
        <Link className="pinkText" href="/support">
          Support Server
        </Link>
        .
      </Text>
      <Button mt="md" onClick={handleClick} variant="light">
        {isHomePage ? "Go back" : "Go to Home page"}
      </Button>
    </Container>
  )
}
