"use client"

import { Center, RingProgress, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export default function RaceRing({ stat }) {
  const isMobile = useMediaQuery("(max-width: 35em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  const { color, text, value } = stat
  const shortenText = text.length > 3

  const fontSize = isMobile ? 0.75 : isTablet ? 0.9 : 1
  const valueSize = `${shortenText ? fontSize - 0.1 : fontSize}rem`

  const size = isMobile ? 50 : isTablet ? 70 : 80
  const ringSize = shortenText && size < 80 ? size + 10 : size

  return (
    <RingProgress
      label={
        <Center>
          <Text fw={800} fz={valueSize}>
            {text}
          </Text>
        </Center>
      }
      roundCaps
      sections={[{ color, value }]}
      size={ringSize}
      thickness={ringSize / 10}
    />
  )
}
