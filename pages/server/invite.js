import { useRouter } from "next/navigation"
import { NextSeo } from "next-seo"
import { useEffect } from "react"

export default function ServerInvite() {
  const router = useRouter()

  useEffect(() => {
    router.push("https://discord.com/invite/fFY3cnMmnH")
  })

  return (
    <NextSeo
      title="Support Server Invite"
      openGraph={{
        title: "Support Server Invite",
        url: "https://discord.com/invite/fFY3cnMmnH",
      }}
    />
  )
}
