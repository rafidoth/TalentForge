import { Table, Badge, Tooltip, Group, Text, TooltipFloating } from "@mantine/core";
import { Info } from "@phosphor-icons/react";
import type { AttributeDto } from "../../api/types";

export interface ProfileAttributeTableProps {
  attributes: AttributeDto[];
  profileAttributeMap: Map<string, any>;
  onRowClick: (attribute: AttributeDto) => void;
}

export function ProfileAttributeTable({ attributes, profileAttributeMap, onRowClick }: ProfileAttributeTableProps) {
  return (
    <Table.ScrollContainer minWidth={500}>
      <Table highlightOnHover withRowBorders withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attributes.map((attr) => {
            const isAdded = profileAttributeMap.has(attr.id);
            return (
              <TooltipFloating
                key={attr.id}
                label={"Click to view details"}
              >
                <Table.Tr
                  key={attr.id}
                  onClick={() => onRowClick(attr)}
                  style={{ cursor: "pointer" }}
                >
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
                    <Badge variant="light" color="blue">
                      {attr.typeName}
                    </Badge>
                  </Table.Td>
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
                </Table.Tr>
              </TooltipFloating>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
