'use client'

import { useRouter } from 'next-nprogress-bar'
import { useEffect } from 'react'

import { postStripePortal } from '../../../actions/api'
import Redirecting from '../../../components/ui/redirecting'

export default function SubscriptionsPage() {
  const router = useRouter()

  useEffect(() => {
    let timeoutId

    postStripePortal()
      .then(({ url }) => {
        if (url) {
          window.location.href = url
        } else {
          router.push('/upgrade')
        }

        return
      })
      .catch(() => router.push('/upgrade'))

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [router])

  return <Redirecting />
}
