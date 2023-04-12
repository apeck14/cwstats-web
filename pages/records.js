import { NextSeo } from "next-seo"

import ComingSoon from "../components/ComingSoon"

export default function Records() {
  return (
    <>
      <NextSeo
        title="CW2 Records"
        description="View all CW2 records, tracked by CWStats."
        openGraph={{
          title: "CW2 Records",
          description: "View all CW2 records, tracked by CWStats.",
        }}
      />
      <ComingSoon />
    </>
  )
}
