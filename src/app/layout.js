import "@mantine/core/styles.css"
import "./globals.css"
import "@mantine/notifications/styles.css"

import { GoogleAnalytics } from "@next/third-parties/google"
import { getServerSession } from "next-auth"

import AppLayout from "@/components/app-layout"
import AppFooter from "@/components/app-layout/footer"
import NextAuthProvider from "@/components/session-provider"
import { CWSTATS_DESC } from "@/static/constants"

import { authOptions } from "./api/auth/[...nextauth]/route"
import ThemeProvider from "./theme"

export const viewport = {
  colorScheme: "dark",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A191B",
  width: "device-width",
}

export const metadata = {
  description: CWSTATS_DESC,
  metadataBase: new URL("https://cwstats.com"),
  openGraph: {
    images: "/assets/icons/logo-og.webp",
    locale: "en_US",
    siteName: "CWStats",
    type: "website",
  },
  title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
}

export const maxDuration = 20

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID} />
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
