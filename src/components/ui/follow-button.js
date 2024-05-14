import { ActionIcon, Button } from "@mantine/core"
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react"

export default function FollowButton({ followed, handleToggle, showText }) {
  const Icon = followed ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />

  return showText ? (
    <Button color="pink" leftSection={Icon} onClick={handleToggle} size="xs" variant="light" visibleFrom="md">
      {followed ? "Unfollow" : "Follow"}
    </Button>
  ) : (
    <ActionIcon color="pink" onClick={handleToggle} variant="light">
      {Icon}
    </ActionIcon>
  )
}
