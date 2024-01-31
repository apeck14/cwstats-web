"use client"

import { AxiomWebVitals } from "next-axiom"
import { event,GoogleAnalytics } from "nextjs-google-analytics"

export function reportWebVitals({ id, label, name, value }) {
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    label: id,
    nonInteraction: true,
    value: Math.round(name === "CLS" ? value * 1000 : value),
  })
}

export default function Analytics() {
  return (
    <>
      <AxiomWebVitals />
      <GoogleAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}
        trackPageViews={{ ignoreHashChange: true }}
      />
    </>
  )
}
