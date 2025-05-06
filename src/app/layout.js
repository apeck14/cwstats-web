import "@mantine/core/styles.css"
import "./globals.css"
import "@mantine/notifications/styles.css"
import "@mantine/charts/styles.css"

import { GoogleAnalytics } from "@next/third-parties/google"
import { getServerSession } from "next-auth"

import AppLayout from "@/components/app-layout"
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
    description: CWSTATS_DESC,
    images: [
      {
        alt: "CWStats Logo",
        height: 128,
        url: "https://cwstats.com/assets/icons/logo-og.webp",
        width: 124,
      },
    ],
    locale: "en_US",
    siteName: "CWStats",
    title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
    type: "website",
    url: "https://cwstats.com",
  },
  title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
  twitter: {
    card: "summary",
  },
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID} />
      <body>
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
