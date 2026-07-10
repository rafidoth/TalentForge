import { Card, Stack, Text, Table, TextInput, ActionIcon, Button, Group } from "@mantine/core";
import { useState, useEffect } from "react";
import { TrashIcon, PlusIcon } from "@phosphor-icons/react";
import { useUpdatePosition } from "~/hooks/usePositions";
import type { PositionDto } from "~/api/positions";

interface TechnologyTagsTabProps {
  positionId: string;
  position: PositionDto;
}

export function TechnologyTagsTab({ positionId, position }: TechnologyTagsTabProps) {
  const updateMutation = useUpdatePosition();
  const [technologyTags, setTechnologyTags] = useState<any[]>([]);

  useEffect(() => {
    setTechnologyTags(position.technologyTags || []);
  }, [position]);

  const handleSave = () => {
    updateMutation.mutate({ id: positionId, dto: { technologyTags } });
  };

  return (
    <Card withBorder radius="md" padding="xl">
      <Stack gap="md">
        <Text fw={500}>Technology Tags</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tag ID</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {technologyTags.map((tag, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <TextInput 
                    value={tag.tagId || ''} 
                    onChange={(e) => {
                      const newTags = [...technologyTags];
                      newTags[index].tagId = e.currentTarget.value;
                      setTechnologyTags(newTags);
                    }}
                    placeholder="Guid"
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon color="red" onClick={() => setTechnologyTags(technologyTags.filter((_, i) => i !== index))}>
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
          onClick={() => setTechnologyTags([...technologyTags, { tagId: '' }])}
        >
          Add Technology Tag
        </Button>
        <Group justify="flex-end">
          <Button onClick={handleSave} loading={updateMutation.isPending}>Save Tags</Button>
        </Group>
      </Stack>
    </Card>
  );
}
