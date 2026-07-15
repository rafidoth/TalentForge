import {
  Button,
  Group,
  Stack,
  Text,
  Paper,
  Badge,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  PlusIcon,
  DotsThreeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { AttributeDto, ProfileAttributeDto } from "../../api/types";
import { ProfileAttributeInput } from "~/components/profile";
import type { AttributeValue, InlineFormState } from "./profileAttributeTypes";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ProfileAttributeCardProps {
  attribute: AttributeDto;
  profileAttribute: ProfileAttributeDto | undefined;
  inlineForm: InlineFormState;
  isMutating: boolean;
  isRemoving: boolean;
  onInitiateAdd: (attr: AttributeDto) => void;
  onInitiateEdit: (attr: AttributeDto) => void;
  onConfirm: (attr: AttributeDto) => void;
  onCancel: () => void;
  onRemove: (attr: AttributeDto) => void;
  onValueChange: (value: AttributeValue) => void;
  /** Opens the attribute definition editor (name, type, category…). */
  onEditDefinition: (attr: AttributeDto) => void;
  /** Deletes the attribute definition from the library entirely. */
  onDeleteDefinition: (attr: AttributeDto) => void;
  isDeleting: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileAttributeCard({
  attribute: attr,
  profileAttribute,
  inlineForm,
  isMutating,
  isRemoving,
  onInitiateAdd,
  onInitiateEdit,
  onConfirm,
  onCancel,
  onRemove,
  onValueChange,
  onEditDefinition,
  onDeleteDefinition,
  isDeleting,
}: ProfileAttributeCardProps) {
  const isInProfile = profileAttribute !== undefined;
  const isActiveForm = inlineForm.attrId === attr.id && inlineForm.mode !== null;

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
      {/* ── Header: name / description / category + overflow menu ────── */}
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group wrap="nowrap" align="flex-start" gap="sm">
          <div>
            <Text fw={600} size="sm" lineClamp={2}>
              {attr.name}
            </Text>
            {attr.description && (
              <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                {attr.description}
              </Text>
            )}
            <Text size="xs" c="dimmed" mt={2}>
              {attr.categoryName}
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
              onClick={() => onEditDefinition(attr)}
            >
              Edit Attribute
            </Menu.Item>
            {!attr.isBuiltin && (
              <Menu.Item
                leftSection={<TrashIcon size={14} />}
                color="red"
                onClick={() => onDeleteDefinition(attr)}
                disabled={isDeleting}
              >
                Delete Attribute
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* ── Inline form (shared by add & edit) ───────────────────────── */}
      {isActiveForm ? (
        <Stack mt="md">
          <ProfileAttributeInput
            attribute={{
              id: attr.id,
              attributeName: attr.name,
              typeName: attr.typeName,
              dropdownOptions: attr.dropdownOptions,
            }}
            value={inlineForm.value}
            onChange={(_, val) => onValueChange(val)}
          />
          <Group justify="flex-end" mt="xs">
            <Button
              size="xs"
              variant="default"
              onClick={onCancel}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={() => onConfirm(attr)}
              loading={isMutating}
            >
              {inlineForm.mode === "edit" ? "Update" : "Save"}
            </Button>
          </Group>
        </Stack>
      ) : (
        /* ── Footer: badges + action buttons ───────────────────────── */
        <Group
          gap="xs"
          mt="auto"
          pt="md"
          justify="space-between"
          align="center"
        >
          <Group gap="xs">
            <Badge variant="dot" color="gray" size="xs">
              {attr.typeName}
            </Badge>
            {isInProfile && (
              <Badge color="blue" size="xs">
                In Profile
              </Badge>
            )}
          </Group>
          <Group gap="xs">
            {isInProfile ? (
              <>
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="gray"
                  leftSection={<PencilSimpleIcon size={12} />}
                  onClick={() => onInitiateEdit(attr)}
                >
                  Edit Value
                </Button>
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="red"
                  leftSection={<TrashIcon size={12} />}
                  onClick={() => onRemove(attr)}
                  loading={isRemoving}
                >
                  Remove
                </Button>
              </>
            ) : (
              <Button
                size="compact-xs"
                variant="light"
                leftSection={<PlusIcon size={12} />}
                onClick={() => onInitiateAdd(attr)}
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
