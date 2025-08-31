"use client"

import PlusIcon from "./ui/plus-icon"
import ProIcon from "./ui/pro-icon"

const sizePx = {
  sm: 20,
  xs: 16,
}

export default function ClanTierIcon({
  isMobile,
  isPlus,
  isPro,
  showNonPlusIcon = true,
  showPopover = true,
  size = "sm",
}) {
  return isPro ? (
    <ProIcon isMobile={isMobile} showPopover={showPopover} size={size} />
  ) : (
    <PlusIcon height={sizePx[size]} isPlus={isPlus} showNonPlusIcon={showNonPlusIcon} showPopover={showPopover} />
  )
}
