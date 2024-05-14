import { Button, Dialog, Group, Text } from "@mantine/core"

export default function SaveSettingsDialog({ isOpen, onClose, onSave }) {
  return (
    <Dialog
      onClose={onClose}
      opened={isOpen}
      radius="md"
      size="lg"
      transitionProps={{ transition: "slide-up" }}
      w="100%"
    >
      <Group justify="space-between" wrap="nowrap">
        <Text c="gray.1" fz={{ base: "xs", lg: "lg", md: "sm" }}>
          You have unsaved changes. Would you like to save these changes?
        </Text>
        <Button miw="fit-content" onClick={onSave}>
          Save
        </Button>
      </Group>
    </Dialog>
  )
}
