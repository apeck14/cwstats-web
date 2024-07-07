"use client"

/* eslint-disable perfectionist/sort-objects */
import { createTheme, MantineProvider, TextInput } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { Source_Sans_3 } from "next/font/google"
import { AppProgressBar } from "next-nprogress-bar"

const SourceSans3 = Source_Sans_3({ display: "swap", subsets: ["latin"] })

export const darkTheme = [
  "#EEEEF0",
  "#B5B2BC",
  "#7C7A85",
  "#6F6D78",
  "#606060",
  "#625F69",
  "#49474E",
  "#323035",
  "#2B292D",
  "#232225",
  "#1A191B",
  "#121113",
]

const theme = createTheme({
  black: darkTheme[darkTheme.length - 1],
  breakpoints: {
    xs: "23.75em",
    sm: "30em",
    md: "48em",
    lg: "64em",
    xl: "75em",
  },
  colors: {
    dark: darkTheme,
    gray: darkTheme,
  },
  components: {
    TextInput: TextInput.extend({
      size: "md",
    }),
  },
  cursorType: "pointer",
  defaultGradient: {
    from: "#ff922b",
    to: "#ff237a",
    deg: 135,
  },
  fontFamily: SourceSans3.style.fontFamily,
  primaryColor: "pink",
  primaryShade: 6,
  white: darkTheme[0],
})

export default function ThemeProvider({ children }) {
  return (
    <MantineProvider forceColorScheme="dark" theme={theme}>
      <Notifications />
      <AppProgressBar color="#ff237a" options={{ showSpinner: false }} shallowRouting />
      {children}
    </MantineProvider>
  )
}
