import "@mantine/core/styles.css"
import "./globals.css"
import "@mantine/nprogress/styles.css"
import "@mantine/notifications/styles.css"

import { getServerSession } from "next-auth"

import AppLayout from "../components/app-layout"
import AppFooter from "../components/app-layout/footer"
import NextAuthProvider from "../components/session-provider"
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
  description: "The trusted source for everything clan wars.",
  "opengraph-image": "/assets/icons/logo.png",
  title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
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
