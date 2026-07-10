import { Group, Text, Badge, ActionIcon, Menu, Paper, Checkbox, Tooltip } from "@mantine/core";
import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import type { AttributeDto } from "../../api/types";
import { useAddPositionAttribute, useRemovePositionAttribute, useDeleteAttribute } from "./useAttributes";

export interface AttributeItemProps {
  attribute: AttributeDto;
  positionId?: string;
  isAddedToPosition: boolean;
  onEdit: () => void;
}

export function AttributeItem({ attribute, positionId, isAddedToPosition, onEdit }: AttributeItemProps) {
  const { mutate: addAttribute, isPending: isAdding } = useAddPositionAttribute();
  const { mutate: removeAttribute, isPending: isRemoving } = useRemovePositionAttribute();
  const { mutate: deleteAttribute, isPending: isDeleting } = useDeleteAttribute();

  const handleTogglePosition = () => {
    if (!positionId) return;

    if (isAddedToPosition) {
      removeAttribute({ positionId, attributeId: attribute.id });
    } else {
      addAttribute({ positionId, dto: { attributeId: attribute.id } });
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${attribute.name}?`)) {
      deleteAttribute(attribute.id);
    }
  };

  const isToggling = isAdding || isRemoving;

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group wrap="nowrap" align="flex-start" gap="sm">
          {positionId && (
            <Tooltip label={isAddedToPosition ? "Remove from Position" : "Add to Position"}>
              <Checkbox
                checked={isAddedToPosition}
                onChange={handleTogglePosition}
                disabled={isToggling}
                size="sm"
                mt={4}
              />
            </Tooltip>
          )}
          <div>
            <Text fw={600} size="sm" lineClamp={2}>{attribute.name}</Text>
            <Text size="xs" c="dimmed" mt={2}>{attribute.categoryName}</Text>
          </div>
        </Group>

        <Menu shadow="md" width={160} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <DotsThreeIcon size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<PencilSimpleIcon size={14} />} onClick={onEdit}>
              Edit Attribute
            </Menu.Item>
            {!attribute.isBuiltin && (
              <Menu.Item
                leftSection={<TrashIcon size={14} />}
                color="red"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                Delete Attribute
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Group gap="xs" mt="auto" pt="md">
        <Badge variant="dot" color="gray" size="xs">{attribute.typeName}</Badge>
        {attribute.isBuiltin && <Badge color="teal" size="xs">Built-in</Badge>}
      </Group>
    </Paper>
  );
}
