import { Button, Group, Modal, Pill } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"

import classes from "./header.module.css"

export default function SearchModal() {
  const [opened, { close, open }] = useDisclosure(false)

  return (
    <>
      <Modal onClose={close} opened={opened} withCloseButton={false}>
        Test
      </Modal>

      <Button bg="gray.9" c="gray.1" className={classes.searchButton} h="2rem" onClick={open} p="xs">
        <Group gap="xs" justify="space-between" w="10rem">
          <Group>
            <IconSearch size="0.75rem" />
            Search...
          </Group>
          <Pill c="gray.1" radius="lg" size="xs">
            Ctrl + k
          </Pill>
        </Group>
      </Button>
    </>
  )
}
