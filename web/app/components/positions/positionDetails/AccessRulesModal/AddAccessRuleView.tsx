import { Stack, Text, Select, TextInput, Group, Button, NumberInput, Radio } from "@mantine/core";
import { RuleOperator } from "~/api/types";
import type { AttributeDto } from "~/api/types";

interface Props {
  availableAttributes: AttributeDto[];
  selectedAttribute: AttributeDto | undefined;
  attributeId: string | null;
  onAttributeChange: (val: string | null) => void;

  availableOperators: { value: string; label: string }[];
  operator: string | null;
  onOperatorChange: (val: string | null) => void;

  expectedValue: string;
  onExpectedValueChange: (val: string) => void;

  isSubmitDisabled: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddAccessRuleView({
  availableAttributes,
  selectedAttribute,
  attributeId,
  onAttributeChange,
  availableOperators,
  operator,
  onOperatorChange,
  expectedValue,
  onExpectedValueChange,
  isSubmitDisabled,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Stack gap="md" p="sm" style={{ borderRadius: 8 }}>
      <Text fw={500}>Add New Rule</Text>

      <Select
        label="Select Attribute"
        placeholder="Choose attribute"
        data={availableAttributes.map((a) => ({ value: a.id, label: a.name }))}
        value={attributeId}
        onChange={onAttributeChange}
      />

      <Select
        label="Operator"
        placeholder="Choose operator"
        data={availableOperators}
        value={operator}
        onChange={onOperatorChange}
        disabled={!attributeId}
      />

      {selectedAttribute?.typeName === "Boolean" ? (
        <Radio.Group
          label="Expected Value"
          value={expectedValue}
          onChange={onExpectedValueChange}
        >
          <Group mt="xs">
            <Radio value="true" label="True" />
            <Radio value="false" label="False" />
          </Group>
        </Radio.Group>
      ) : selectedAttribute?.typeName === "Numeric" ? (
        <NumberInput
          label="Expected Value"
          placeholder="Enter numeric value"
          value={expectedValue ? Number(expectedValue) : ""}
          onChange={(val) => onExpectedValueChange(val !== "" ? String(val) : "")}
        />
      ) : (
        <TextInput
          label="Expected Value"
          placeholder="Enter value"
          value={expectedValue}
          onChange={(e) => onExpectedValueChange(e.currentTarget.value)}
        />
      )}

      <Group justify="flex-end" mt="sm">
        <Button variant="subtle" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit} disabled={isSubmitDisabled}>
          Save Rule
        </Button>
      </Group>
    </Stack>
  );
}
