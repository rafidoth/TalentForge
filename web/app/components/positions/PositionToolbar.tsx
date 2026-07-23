import { Group, TextInput, Tooltip, ActionIcon } from "@mantine/core";
import { MagnifyingGlass, Plus, Copy, Trash } from "@phosphor-icons/react";
import { usePositionStore } from "~/store/positionStore";
import { usePositionBulkActions } from "~/hooks/usePositionBulkActions";

export function PositionToolbar() {
  const { search, setSearch, openCreateModal } = usePositionStore();
  const {
    handleBulkDelete,
    handleBulkDuplicate,
    isDeletingBulk,
    isDuplicatingBulk,
    hasSelection,
  } = usePositionBulkActions();

  return (
    <Group align="flex-end" justify="space-between">
      <Group flex={1} align="flex-end">
        <TextInput
          placeholder="Search positions..."
          leftSection={<MagnifyingGlass size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={250}
        />

        <Group gap="xs" align="center" ml="auto">
          <Tooltip label="New Position" withArrow>
            <ActionIcon
              variant="light"
              size="lg"
              color="gray"
              onClick={openCreateModal}
            >
              <Plus size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Duplicate Position" withArrow>
            <ActionIcon
              variant="light"
              size="lg"
              color="blue"
              disabled={!hasSelection}
              onClick={handleBulkDuplicate}
              loading={isDuplicatingBulk}
            >
              <Copy size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete Position" withArrow>
            <ActionIcon
              variant="light"
              size="lg"
              color="red"
              disabled={!hasSelection}
              onClick={handleBulkDelete}
              loading={isDeletingBulk}
            >
              <Trash size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Group>
  );
}
