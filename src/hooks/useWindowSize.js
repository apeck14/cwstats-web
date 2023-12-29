/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from "react"

const getBreakpoint = (width) =>
  width <= 380 ? "xs" : width <= 480 ? "sm" : width <= 768 ? "md" : width <= 1024 ? "lg" : "xl"

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    breakpoint: undefined,
    height: undefined,
    width: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
        breakpoint: getBreakpoint(window.innerWidth),
      })
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
