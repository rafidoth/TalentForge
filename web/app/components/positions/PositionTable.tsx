import { Table, Checkbox, Group, Text, Badge } from "@mantine/core";
import type { PositionDto } from "~/api/positions";
import { formatDate } from "~/utils/date";

export interface PositionTableProps {
  positions: PositionDto[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function PositionTable({
  positions,
  selectedIds,
  onToggleSelect,
  onRowClick,
}: PositionTableProps) {
  const sortedPositions = [...positions].sort(
    (a, b) => (b.submittedCvCount ?? 0) - (a.submittedCvCount ?? 0)
  );

  return (
    <Table.ScrollContainer minWidth={600} maxHeight={600}>
      <Table highlightOnHover withRowBorders withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}></Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Last Updated At</Table.Th>
            <Table.Th>Submitted CVs</Table.Th>
            <Table.Th>Max Projects</Table.Th>
            <Table.Th>Visibility</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPositions.map((position) => {
            const isSelected = selectedIds.has(position.id);
            return (
              <Table.Tr
                key={position.id}
                bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}
                style={{ cursor: "pointer" }}
                onClick={() => onRowClick(position.id)}
              >
                <Table.Td onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(position.id)}
                    aria-label={`Select ${position.title}`}
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{position.title}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {formatDate(position.updatedAt || position.createdAt, 'MMM d, yyyy')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{position.submittedCvCount ?? 0}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{position.maxProjects}</Text>
                </Table.Td>
                <Table.Td>
                  {position.isPublic ? (
                    <Badge color="green" variant="light">
                      Public
                    </Badge>
                  ) : (
                    <Badge color="gray" variant="light">
                      Private
                    </Badge>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
          {positions.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed" py="xl">
                  No positions found. Create one to get started!
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
