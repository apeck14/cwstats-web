import { NextSeo } from "next-seo"

import ComingSoon from "../components/ComingSoon"

export default function Docs() {
  return (
    <>
      <NextSeo
        title="CWStats | Documentation"
        description="Need help? Full documentation including the Discord bot, website and everything in-between."
        openGraph={{
          title: "CWStats | Documentation",
          description:
            "Need help? Full documentation including the Discord bot, website and everything in-between.",
        }}
      />
      <ComingSoon />
    </>
  )
}
