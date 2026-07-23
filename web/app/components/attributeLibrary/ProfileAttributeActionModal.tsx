import { Modal, Button, Group, Stack, Text, Title, Badge } from "@mantine/core";
import { ProfileAttributeInput } from "~/components/profile";
import type { AttributeDto } from "../../api/types";

export interface ProfileAttributeActionModalProps {
  opened: boolean;
  onClose: () => void;
  attribute: AttributeDto | null;
  isAdded: boolean;
  value: any;
  onChange: (val: any) => void;
  onConfirm: () => void;
  onRemove: () => void;
  isLoading: boolean;
  isRemoving: boolean;
}

export function ProfileAttributeActionModal({
  opened,
  onClose,
  attribute,
  isAdded,
  value,
  onChange,
  onConfirm,
  onRemove,
  isLoading,
  isRemoving,
}: ProfileAttributeActionModalProps) {
  if (!attribute) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Manage Attribute Value" centered size={"50%"}>
      <Stack>
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={4}>{attribute.name}</Title>
            <Badge variant="light" color="blue">{attribute.typeName}</Badge>
          </Group>
          {attribute.description && (
            <Text size="sm" c="dimmed" mb="md">
              {attribute.description}
            </Text>
          )}
        </div>

        <ProfileAttributeInput
          attribute={{
            id: attribute.id,
            attributeName: attribute.name,
            typeName: attribute.typeName,
            dropdownOptions: attribute.dropdownOptions,
          }}
          value={value}
          onChange={(_, val) => onChange(val)}
        />

        <Group justify="flex-end" mt="xl">
          {isAdded && (
            <Button
              variant="light"
              color="red"
              onClick={onRemove}
              loading={isRemoving}
              disabled={isLoading}
              mr="auto"
            >
              Remove
            </Button>
          )}
          <Button variant="default" onClick={onClose} disabled={isLoading || isRemoving}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={isLoading} disabled={isRemoving}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
