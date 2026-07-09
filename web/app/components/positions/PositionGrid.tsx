import { SimpleGrid, Center, Text } from '@mantine/core';
import type { PositionDto } from '~/api/positions';
import { PositionCard } from './PositionCard';

interface PositionGridProps {
  data: PositionDto[];
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onClick: (id: string) => void;
}

export function PositionGrid({ data, onDelete, onDuplicate, onClick }: PositionGridProps) {
  if (!data || data.length === 0) {
    return (
      <Center p="xl" mih={200}>
        <Text c="dimmed">No positions found. Create one to get started!</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {data.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          onDelete={() => onDelete(position.id)}
          onDuplicate={() => onDuplicate(position.id)}
          onClick={() => onClick(position.id)}
        />
      ))}
    </SimpleGrid>
  );
}
