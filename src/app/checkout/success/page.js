import { Button, Container, Stack, Text, Title } from "@mantine/core"
import { IconCircleDashedCheck } from "@tabler/icons-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getStripeRedirectUrl } from "../../../actions/stripe"

export const metadata = {
  description: "CWStats Pro subscription was successfully enabled!",
  title: "Success | CWStats Pro",
}

export const dynamic = "force-dynamic"

export default async function CheckoutSuccessPage({ searchParams }) {
  const { sessionId } = searchParams

  if (!sessionId) {
    notFound()
  }

  const { url: redirectUrl } = await getStripeRedirectUrl(sessionId)

  return (
    <Container size="lg">
      <Stack align="center" my="25%" ta="center">
        <IconCircleDashedCheck color="var(--mantine-color-green-6)" size="6rem" />
        <Title fz={{ base: "1.5rem", md: "2.25rem" }}>
          <span className="gradientText">CWStats PRO</span> successfully enabled!
        </Title>
        <Text c="gray.1" fw="600" fz={{ base: "1rem", md: "1.25rem" }}>
          Thank you for your support! Please reach out to us on Discord if you have any questions.
        </Text>
        <Button color="green" component={Link} href={redirectUrl} mt="2rem" variant="light">
          Return
        </Button>
      </Stack>
    </Container>
  )
}
