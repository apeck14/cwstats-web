import "@mantine/core/styles.css"
import "./globals.css"

import { getServerSession } from "next-auth"

import AppLayout from "../components/app-layout"
import AppFooter from "../components/app-layout/footer"
import NextAuthProvider from "../components/session-provider"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ThemeProvider from "./theme"

export const viewport = {
  themeColor: "#1A191B",
}

export const metadata = {
  title: "CWStats",
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
