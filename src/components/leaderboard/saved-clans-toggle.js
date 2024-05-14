"use client"

import { Chip } from "@mantine/core"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"

export default function SavedClansToggle({ handleChange, hiddenFrom, loggedIn, visibleFrom }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [checked, setChecked] = useState(false)

  const handleToggle = () => {
    if (!loggedIn) {
      const searchParamsStr = searchParams.toString()
      router.push(`/login?callback=${pathname}${searchParamsStr ? `?${searchParamsStr}` : ""}`)
      return
    }

    setChecked(!checked)
    handleChange()
  }

  return (
    <Chip
      checked={checked}
      color="gray.2"
      fw={600}
      hiddenFrom={hiddenFrom}
      ml="auto"
      onChange={handleToggle}
      radius="md"
      visibleFrom={visibleFrom}
    >
      My Clans
    </Chip>
  )
}
