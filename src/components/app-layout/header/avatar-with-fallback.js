"use client"

import { useMediaQuery } from "@mantine/hooks"
import { IconUserCircle } from "@tabler/icons-react"
import { useState } from "react"

import Image from "../../ui/image"
import classes from "./header.module.css"

export default function AvatarWithFallback({ session }) {
  const [error, setError] = useState(false)
  const isMobile = useMediaQuery("(max-width: 30em)")

  const handleError = () => {
    setError(true)
  }

  return error ? (
    <IconUserCircle size={isMobile ? 32 : 36} stroke="0.1rem" style={{ color: "var(--mantine-color-gray-1" }} />
  ) : (
    <Image
      alt="Profile Picture"
      className={classes.avatar}
      height={isMobile ? 32 : 36}
      onError={handleError}
      onLoad={({ currentTarget }) => {
        if (currentTarget?.height === 0) {
          handleError()
        }
      }}
      src={session?.user?.image}
    />
  )
}
