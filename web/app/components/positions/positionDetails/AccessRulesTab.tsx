import { Card, Stack, Text, Table, TextInput, Select, ActionIcon, Button, Group } from "@mantine/core";
import { useState, useEffect } from "react";
import { TrashIcon, PlusIcon } from "@phosphor-icons/react";
import { useUpdatePosition } from "~/hooks/usePositions";
import type { PositionDto } from "~/api/positions";

interface AccessRulesTabProps {
  positionId: string;
  position: PositionDto;
}

export function AccessRulesTab({ positionId, position }: AccessRulesTabProps) {
  const updateMutation = useUpdatePosition();
  const [accessRules, setAccessRules] = useState<any[]>([]);

  useEffect(() => {
    setAccessRules(position.accessRules || []);
  }, [position]);

  const handleSave = () => {
    updateMutation.mutate({ id: positionId, dto: { accessRules } });
  };

  return (
    <Card withBorder radius="md" padding="xl">
      <Stack gap="md">
        <Text fw={500}>Access Rules</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Attribute ID</Table.Th>
              <Table.Th>Operator</Table.Th>
              <Table.Th>Expected Value</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {accessRules.map((rule, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <TextInput 
                    value={rule.attributeId || ''} 
                    onChange={(e) => {
                      const newRules = [...accessRules];
                      newRules[index].attributeId = e.currentTarget.value;
                      setAccessRules(newRules);
                    }}
                    placeholder="Guid"
                  />
                </Table.Td>
                <Table.Td>
                  <Select 
                    data={['Equals', 'NotEquals', 'Contains', 'GreaterThan', 'LessThan']}
                    value={rule.operator || 'Equals'} 
                    onChange={(val) => {
                      const newRules = [...accessRules];
                      newRules[index].operator = val;
                      setAccessRules(newRules);
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput 
                    value={rule.expectedValue || ''} 
                    onChange={(e) => {
                      const newRules = [...accessRules];
                      newRules[index].expectedValue = e.currentTarget.value;
                      setAccessRules(newRules);
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon color="red" onClick={() => setAccessRules(accessRules.filter((_, i) => i !== index))}>
                    <TrashIcon />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Button 
          variant="light" 
          leftSection={<PlusIcon />} 
          onClick={() => setAccessRules([...accessRules, { attributeId: '', operator: 'Equals', expectedValue: '' }])}
        >
          Add Access Rule
        </Button>
        <Group justify="flex-end">
          <Button onClick={handleSave} loading={updateMutation.isPending}>Save Rules</Button>
        </Group>
      </Stack>
    </Card>
  );
}
