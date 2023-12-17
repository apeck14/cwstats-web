import { NextSeo } from "next-seo"

import ComingSoon from "../components/ComingSoon"

export default function Docs() {
  return (
    <>
      <NextSeo
        description="Need help? Full documentation including the Discord bot, website and everything in-between."
        openGraph={{
          description: "Need help? Full documentation including the Discord bot, website and everything in-between.",
          title: "CWStats | Documentation",
        }}
        title="CWStats | Documentation"
      />
      <ComingSoon />
    </>
  )
}
