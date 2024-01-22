"use client"

import { Center, RingProgress, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export default function RaceRing({ stat }) {
  const isMobile = useMediaQuery("(max-width: 35em)")
  const isTablet = useMediaQuery("(max-width: 48em)")

  const placeSize = `${isMobile ? 0.75 : isTablet ? 0.9 : 1}rem`
  const ringSize = isMobile ? 50 : isTablet ? 70 : 80

  return (
    <RingProgress
      label={
        <Center>
          <Text fw={800} fz={placeSize}>
            {stat.place}
          </Text>
        </Center>
      }
      roundCaps
      sections={[{ color: stat.color, value: stat.progress }]}
      size={ringSize}
      thickness={ringSize / 10}
    />
  )
}
