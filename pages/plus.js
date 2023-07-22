import { NextSeo } from "next-seo"

import ComingSoon from "../components/ComingSoon"

export default function Docs() {
  return (
    <>
      <NextSeo
        title="CWStats+"
        description="Enable detailed clan tracking, and other statistics with CWStats+...all for FREE!"
        openGraph={{
          title: "CWStats+",
          description: "Enable detailed clan tracking, and other statistics with CWStats+...all for FREE!",
        }}
      />
      <ComingSoon />
    </>
  )
}
