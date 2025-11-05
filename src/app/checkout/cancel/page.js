import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { IconCreditCardOff } from '@tabler/icons-react'
import Link from 'next/link'

export const metadata = {
  description: 'CWStats Pro subscription was successfully cancelled.',
  title: 'Cancel | CWStats Pro'
}

export default function CheckoutCancelPage() {
  return (
    <Container size='lg'>
      <Stack align='center' my='25%' ta='center'>
        <IconCreditCardOff color='var(--mantine-color-red-6)' size='6rem' />
        <Title fz={{ base: '1.75rem', md: '2.5rem' }}>We&apos;re sad to see you go!</Title>
        <Text c='gray.1' fz={{ base: '1rem', md: '1.25rem' }}>
          Your transaction was successfully cancelled.
        </Text>
        <Button component={Link} href='/' mt='2rem' variant='light'>
          Home
        </Button>
      </Stack>
    </Container>
  )
}
