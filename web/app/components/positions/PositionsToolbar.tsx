import { Group, Button, TextInput, Title } from '@mantine/core';
import { Plus, MagnifyingGlass } from '@phosphor-icons/react';

interface PositionsToolbarProps {
  onAdd: () => void;
}

export function PositionsToolbar({ onAdd }: PositionsToolbarProps) {
  return (
    <Group justify="space-between" mb="md">
      <Title order={2}>Positions</Title>
      <Group>
        <TextInput
          placeholder="Search positions..."
          leftSection={<MagnifyingGlass size={16} />}
        />
        <Button leftSection={<Plus size={16} />} onClick={onAdd}>
          Add Position
        </Button>
      </Group>
    </Group>
  );
}
