import { Button, Group, Stack } from "@mantine/core";
import { ProfileAttributeInput } from "~/components/profile";
import type { AttributeDto } from "../../api/types";

export interface ProfileAttributeCardInlineFormProps {
  attribute: AttributeDto;
  value: any;
  onChange: (val: any) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ProfileAttributeCardInlineForm({
  attribute,
  value,
  onChange,
  onCancel,
  onConfirm,
  isLoading,
}: ProfileAttributeCardInlineFormProps) {
  return (
    <Stack mt="md">
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
      <Group justify="flex-end" mt="xs">
        <Button
          size="xs"
          variant="default"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button size="xs" onClick={onConfirm} loading={isLoading}>
          Save
        </Button>
      </Group>
    </Stack>
  );
}
