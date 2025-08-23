import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { postStripePortal } from "@/actions/api"

export default async function SubscriptionsPage() {
  const cookieStore = cookies()
  const userToken = cookieStore.get("next-auth.session-token")?.value
  if (!userToken) redirect("/login")

  try {
    const { url } = await postStripePortal(userToken)

    if (!url) redirect("/upgrade")
    redirect("/portal")
  } catch (err) {
    redirect("/upgrade")
  }
}
