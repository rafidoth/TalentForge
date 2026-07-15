import {
  Paper,
  Group,
  Text,
  Badge,
  ActionIcon,
  Menu,
  Button,
} from "@mantine/core";
import {
  DotsThreeIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import type { AttributeDto } from "../../api/types";
import { ProfileAttributeCardInlineForm } from "./ProfileAttributeCardInlineForm";

export interface ProfileAttributeCardContentProps {
  attribute: AttributeDto;
  isAddedToProfile: boolean;
  isAddingThis: boolean;
  isEditingThis: boolean;
  addValue: any;
  editValue: any;
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  onAddValueChange: (val: any) => void;
  onEditValueChange: (val: any) => void;
  onCancelAdd: () => void;
  onCancelEdit: () => void;
  onConfirmAdd: () => void;
  onConfirmEdit: () => void;
  onInitiateAdd: () => void;
  onInitiateEdit: () => void;
  onRemove: () => void;
}

export function ProfileAttributeCardContent({
  attribute,
  isAddedToProfile,
  isAddingThis,
  isEditingThis,
  addValue,
  editValue,
  isAdding,
  isUpdating,
  isRemoving,
  onAddValueChange,
  onEditValueChange,
  onCancelAdd,
  onCancelEdit,
  onConfirmAdd,
  onConfirmEdit,
  onInitiateAdd,
  onInitiateEdit,
  onRemove,
}: ProfileAttributeCardContentProps) {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group wrap="nowrap" align="flex-start" gap="sm">
          <div>
            <Text fw={600} size="sm" lineClamp={2}>
              {attribute.name}
            </Text>
            {attribute.description && (
              <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                {attribute.description}
              </Text>
            )}
            <Text size="xs" c="dimmed" mt={2}>
              {attribute.categoryName}
            </Text>
          </div>
        </Group>

        <Menu shadow="md" width={160} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <DotsThreeIcon size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<PencilSimpleIcon size={14} />}
              onClick={onInitiateEdit}
            >
              Edit
            </Menu.Item>
            {!attribute.isBuiltin && (
              <Menu.Item
                leftSection={<TrashIcon size={14} />}
                color="red"
                onClick={onRemove}
                disabled={isRemoving}
              >
                Remove
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>

      {isAddingThis ? (
        <ProfileAttributeCardInlineForm
          attribute={attribute}
          value={addValue}
          onChange={onAddValueChange}
          onCancel={onCancelAdd}
          onConfirm={onConfirmAdd}
          isLoading={isAdding}
        />
      ) : isEditingThis ? (
        <ProfileAttributeCardInlineForm
          attribute={attribute}
          value={editValue}
          onChange={onEditValueChange}
          onCancel={onCancelEdit}
          onConfirm={onConfirmEdit}
          isLoading={isUpdating}
        />
      ) : (
        <Group
          gap="xs"
          mt="auto"
          pt="md"
          justify="space-between"
          align="center"
        >
          <Group gap="xs">
            <Badge variant="dot" color="gray" size="xs">
              {attribute.typeName}
            </Badge>
            {isAddedToProfile && (
              <Badge color="blue" size="xs">
                In Profile
              </Badge>
            )}
          </Group>
          <Group gap="xs">
            {!isAddedToProfile && (
              <Button
                size="compact-xs"
                variant="light"
                leftSection={<PlusIcon size={12} />}
                onClick={onInitiateAdd}
              >
                Add to Profile
              </Button>
            )}
          </Group>
        </Group>
      )}
    </Paper>
  );
}
