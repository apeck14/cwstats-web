/* eslint-disable perfectionist/sort-objects */
/* eslint-disable import/prefer-default-export */
export const breakpointObj = (xs, sm, md, lg, xl) => {
  const props = {
    xs,
    sm,
    md,
    lg,
    xl,
  }

  // if all props given, return early
  if (xl) return props

  // not all props given, fill remainder
  const filledObj = {}
  const breakpoints = Object.keys(props)

  for (const key of breakpoints) {
    if (props[key]) filledObj[key] = props[key]
    else {
      const currentIndex = breakpoints.indexOf(key)

      for (const fill of breakpoints.slice(currentIndex)) {
        filledObj[fill] = props[breakpoints[currentIndex - 1]]
      }

      return filledObj
    }
  }
}

export const formatTag = (str, withHastag = false) => {
  const tag = str
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .replace(/O/g, "0")

  return `${withHastag ? "#" : ""}${tag}`
}
