import { ActionIcon, Group, Menu } from "@mantine/core"
import { IconDots, IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"

import FollowButton from "@/components/ui/follow-button"
import { CLAN_IN_GAME_LINK_MOBILE } from "@/static/constants"

export default function MobileActionsMenu({ followed, handleFollowToggle, tag }) {
  return (
    <Menu className="cursorPointer" position="bottom" shadow="md" trapFocus width={200} withArrow>
      <Menu.Target>
        <ActionIcon color="gray.4" size="sm">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown bg="gray.10" p="xs" w="fit-content">
        <Group gap="0.25rem">
          <FollowButton followed={followed} handleToggle={handleFollowToggle} />

          <ActionIcon
            color="gray"
            component={Link}
            href={CLAN_IN_GAME_LINK_MOBILE + tag}
            target="_blank"
            variant="light"
          >
            <IconExternalLink size={20} />
          </ActionIcon>
        </Group>
      </Menu.Dropdown>
    </Menu>
  )
}
