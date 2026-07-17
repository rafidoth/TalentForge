import { Table, Text, Badge, ActionIcon, Group, Button, Stack, Title, Box, Paper } from "@mantine/core";
import { TrashIcon, PlusIcon } from "@phosphor-icons/react";
import type { PositionAccessRuleDto } from "~/api/types";
import { RuleOperator } from "~/api/types";

interface Props {
  rules: PositionAccessRuleDto[];
  isPublic: boolean;
  operatorLabels: Record<RuleOperator, string>;
  onAddRule: () => void;
  onDeleteRule: (id: string) => void;
}

export function AccessRulesTable({ rules, operatorLabels, onAddRule, onDeleteRule }: Props) {
  return (
    <>
      <Group justify="space-between" mb="md" align="center">
        <Title order={3}>Manage Access Rules</Title>
        <Button size="xs" leftSection={<PlusIcon />} onClick={onAddRule}>Add Rule</Button>
      </Group>
      <Box px="md">
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Attribute</Table.Th>
                <Table.Th>Operator</Table.Th>
                <Table.Th>Expected Value</Table.Th>
                <Table.Th w={80}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rules.map((rule) => (
                <Table.Tr key={rule.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{rule.attributeName}</Text>
                    <Text size="xs" c="dimmed">{rule.attributeTypeName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="blue" variant="light">{operatorLabels[rule.operator]}</Badge>
                  </Table.Td>
                  <Table.Td>{rule.expectedValue}</Table.Td>
                  <Table.Td>
                    <ActionIcon color="red" variant="subtle" onClick={() => onDeleteRule(rule.id!)}>
                      <TrashIcon />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>
    </>
  );
}
