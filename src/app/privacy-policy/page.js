"use client"

import { Container, Divider, List, Space, Text, Title } from "@mantine/core"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <Container p="xl" size="lg" w="100%">
      <Title order={1}>Privacy Policy</Title>
      <Text c="dimmed" size="sm">
        Effective Date: 9/1/2025
      </Text>

      <Space h="xl" />

      <Text fw="500">
        CWStats (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains how we collect, use, and
        protect your information when you use CWStats and CWStats PRO (the “Service”). By using the Service, you agree
        to the practices described in this Privacy Policy.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>1. Information We Collect</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>
          <b>Account Information:</b> When you sign up, we may collect your Discord Account ID.
        </List.Item>
        <List.Item>
          <b>Payment Information:</b> Payments are processed securely through Stripe. We do not store your full credit
          card or payment details.
        </List.Item>
        <List.Item>
          <b>Usage Data:</b> We may collect information about how you interact with the Service, such as IP address,
          browser type, and activity on the website.
        </List.Item>
        <List.Item>
          <b>Cookies:</b> We may use cookies to improve site functionality, analyze usage, and remember your
          preferences.
        </List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>2. How We Use Your Information</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>Provide and maintain the Service.</List.Item>
        <List.Item>Process subscription payments.</List.Item>
        <List.Item>Improve features and user experience.</List.Item>
        <List.Item>Communicate with you about your account or important updates.</List.Item>
        <List.Item>Comply with legal obligations.</List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>3. How We Share Information</Title>
      <List c="gray.1" spacing="xs" withPadding>
        <List.Item>
          <b>Service Providers:</b> With trusted vendors (such as Stripe) who help us provide the Service.
        </List.Item>
        <List.Item>
          <b>Legal Compliance:</b> When required to comply with laws or respond to lawful requests.
        </List.Item>
        <List.Item>
          <b>Business Transfers:</b> If CWStats is merged, acquired, or sold, your data may be transferred as part of
          that transaction.
        </List.Item>
      </List>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>4. Data Retention</Title>
      <Text c="gray.1">
        We retain your information for as long as your account is active or as needed to provide the Service. You may
        request deletion of your personal data at any time by contacting us in our{" "}
        <Link className="pinkText" href="/support">
          Support Server
        </Link>
        .
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>5. Your Rights</Title>
      <Text c="gray.1">
        Depending on your location, you may have rights regarding your data, including the ability to access, correct,
        delete, or restrict its use. To exercise these rights, please contact us in our{" "}
        <Link className="pinkText" href="/support">
          Support Server
        </Link>
        .
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>6. Security</Title>
      <Text c="gray.1">
        We take reasonable steps to protect your information using industry-standard measures. However, no system is
        completely secure, and we cannot guarantee absolute security of your data.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>7. Children’s Privacy</Title>
      <Text c="gray.1">
        The Service is not directed to children under 13, and we do not knowingly collect personal information from
        them. If you believe we have collected such data, please contact us immediately.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>8. Changes to This Privacy Policy</Title>
      <Text c="gray.1">
        We may update this Privacy Policy from time to time. If we make material changes, we will notify you by posting
        the updated policy on our website. Continued use of the Service after changes are posted constitutes acceptance
        of the updated Privacy Policy.
      </Text>

      <Divider color="gray.7" my="xl" size="md" />

      <Title order={3}>9. Contact</Title>
      <Text c="gray.1">
        If you have any questions or concerns about this Privacy Policy, please contact us in our{" "}
        <Link className="pinkText" href="/support">
          Support Server
        </Link>
        .
      </Text>
    </Container>
  )
}
