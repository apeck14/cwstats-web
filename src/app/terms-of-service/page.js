"use client"

import { Container, Divider, List, Space, Text, Title } from "@mantine/core"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <Container p="xl" size="lg" w="100%">
      <Title order={1}>Terms of Service</Title>
      <Text c="dimmed" size="sm">
        Effective Date: 9/1/2025
      </Text>

      <Space h="xl" />

      <Text fw="500">
        Welcome to CWStats. These Terms of Service (“Terms”) govern your access to and use of CWStats PRO and related
        services (the “Service”), offered through cwstats.com. By subscribing to CWStats PRO or otherwise using our
        Service, you agree to these Terms. Please read them carefully.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>1. Eligibility</Title>
      <Text c="gray.1">You must be at least 13 years old to purchase CWStats PRO.</Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>2. Subscriptions & Payments</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>
          CWStats PRO is offered as a monthly subscription at $2.99 USD, billed on a recurring basis until canceled.
        </List.Item>
        <List.Item>
          Payments are processed securely through Stripe, which may offer various payment methods depending on your
          region.
        </List.Item>
        <List.Item>
          You authorize CWStats to charge your selected payment method on a recurring monthly basis.
        </List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>3. Refunds & Cancellations</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>All sales are final.</List.Item>
        <List.Item>
          You may cancel your subscription at any time to prevent future charges. Your subscription will remain active
          until the end of the current billing cycle.
        </List.Item>
        <List.Item>
          To cancel, log in to your account and follow the cancellation process, or contact us in our{" "}
          <Link className="pinkText" href="/support">
            Support Server
          </Link>
          .
        </List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>4. User Responsibilities</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>Do not share your account with others.</List.Item>
        <List.Item>Do not use the Service for unlawful purposes.</List.Item>
        <List.Item>Do not attempt to disrupt or interfere with the Service’s operation.</List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>5. Limitation of Liability</Title>
      <Text c="gray.1">
        To the fullest extent permitted by law, CWStats shall not be liable for any indirect, incidental, or
        consequential damages arising from your use of the Service.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>6. Modifications to the Service</Title>
      <Text c="gray.1">
        We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without
        notice.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>7. Changes to Terms</Title>
      <Text c="gray.1">
        We may update these Terms from time to time. If we make material changes, we will notify you by posting the
        updated Terms on our website. Continued use of the Service after changes are posted constitutes acceptance of
        the new Terms.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>8. Governing Law</Title>
      <Text c="gray.1">
        These Terms are governed by and construed in accordance with the laws of the United States, without regard to
        conflict of law principles.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>9. Contact</Title>
      <Text c="gray.1">
        If you have any questions about these Terms or your subscription, please contact us in our{" "}
        <Link className="pinkText" href="/support">
          Support Server
        </Link>
        .
      </Text>
    </Container>
  )
}
