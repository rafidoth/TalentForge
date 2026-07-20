import { Table, Badge, Tooltip, Group, Text, Checkbox } from "@mantine/core";
import { Info } from "@phosphor-icons/react";
import type { AttributeDto } from "../../api/types";

export interface AttributeLibraryTableProps {
  attributes: AttributeDto[];
  addedAttributeIds?: Set<string>;
  selectedIds: Set<string>;
  onToggleSelect: (attributeId: string) => void;
  hideStatus?: boolean;
}

export function AttributeLibraryTable({
  attributes,
  addedAttributeIds,
  selectedIds,
  onToggleSelect,
  hideStatus = false
}: AttributeLibraryTableProps) {
  return (
    <Table.ScrollContainer minWidth={600}>
      <Table highlightOnHover withRowBorders withColumnBorders={false} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}></Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Type</Table.Th>
            {!hideStatus && <Table.Th>Status</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attributes.map((attr) => {
            const isAdded = addedAttributeIds ? addedAttributeIds.has(attr.id) : false;
            const isSelected = selectedIds.has(attr.id);
            return (
              <Table.Tr
                key={attr.id}
                bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}
              >
                <Table.Td>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(attr.id)}
                    aria-label={`Select ${attr.name}`}
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text fw={500}>{attr.name}</Text>
                    {attr.description && (
                      <Tooltip label={attr.description} withArrow multiline w={300}>
                        <Info size={16} color="gray" />
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>

                <Table.Td>
                  {attr.categoryName}
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue">
                    {attr.typeName}
                  </Badge>
                </Table.Td>
                {!hideStatus && (
                  <Table.Td>
                    {isAdded ? (
                      <Badge variant="filled" color="teal">
                        Added
                      </Badge>
                    ) : (
                      <Badge variant="outline" color="gray">
                        Not Added
                      </Badge>
                    )}
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
