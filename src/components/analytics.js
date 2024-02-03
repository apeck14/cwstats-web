"use client"

import { GoogleAnalytics } from "@next/third-parties/google"
import { AxiomWebVitals } from "next-axiom"

export default function Analytics() {
  return (
    <>
      <AxiomWebVitals />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID} />
    </>
  )
}
