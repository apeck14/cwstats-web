import { Group } from "@mantine/core"
import { IconCards, IconNotes, IconSpy, IconTrophy } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"

import classes from "./header.module.css"

export const links = [
  {
    icon: <IconTrophy color="var(--mantine-color-pink-6)" height="1.3rem" />,
    label: "Leaderboards",
    link: "/leaderboard/daily/global",
    query: "leaderboard",
  },
  {
    icon: <IconSpy color="var(--mantine-color-pink-6)" height="1.3rem" />,
    label: "Spy",
    link: "/spy",
    query: "spy",
  },
  {
    icon: <IconNotes color="var(--mantine-color-pink-6)" height="1.3rem" />,
    label: "Docs",
    link: "/docs",
    query: "docs",
  },
  {
    icon: <IconCards color="var(--mantine-color-pink-6)" height="1.3rem" />,
    label: "Decks",
    link: "/decks",
    query: "decks",
  },
]

export default function NavLinks() {
  const router = useRouter()
  const pathname = usePathname()

  return links.map((l) => (
    <Group
      className={`${classes.navItemWrapper}${pathname.includes(l.query) ? ` ${classes.active}` : ""}`}
      h="100%"
      key={l.label}
    >
      <Group
        className={classes.navItem}
        component={Link}
        gap="0.25rem"
        href={l.link}
        onClick={() => router.push(l.link)}
      >
        {l.icon}
        {l.label}
      </Group>
    </Group>
  ))
}
