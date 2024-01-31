import "@mantine/core/styles.css"
import "./globals.css"
import "@mantine/nprogress/styles.css"
import "@mantine/notifications/styles.css"

import { getServerSession } from "next-auth"
import { AxiomWebVitals } from "next-axiom"
import { event, GoogleAnalytics } from "nextjs-google-analytics"

import AppLayout from "../components/app-layout"
import AppFooter from "../components/app-layout/footer"
import NextAuthProvider from "../components/session-provider"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ThemeProvider from "./theme"

export function reportWebVitals({ id, label, name, value }) {
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    label: id,
    nonInteraction: true,
    value: Math.round(name === "CLS" ? value * 1000 : value),
  })
}

export const viewport = {
  colorScheme: "dark",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A191B",
  width: "device-width",
}

export const metadata = {
  description: "The trusted source for everything clan wars.",
  "opengraph-image": "/assets/icons/logo.png",
  title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <AxiomWebVitals />
      <GoogleAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}
        trackPageViews={{ ignoreHashChange: true }}
      />

      <body>
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
            <AppFooter />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
