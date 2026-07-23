import React, { useState } from "react";
import { Table, Checkbox, Group, Text, Badge, Collapse, Box, TooltipFloating } from "@mantine/core";
import type { ProjectDto } from "~/api/types";
import { formatTimePeriod } from "../profile/profileUtils";
import { MarkdownRenderer } from "~/components/common/MarkdownRenderer";

export interface ProjectTableProps {
  projects: ProjectDto[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

export function ProjectTable({
  projects,
  selectedIds,
  onToggleSelect,
}: ProjectTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table highlightOnHover={false} withRowBorders={false} withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}></Table.Th>
            <Table.Th>Project Name</Table.Th>
            <Table.Th>Dates</Table.Th>
            <Table.Th>Tags</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((project) => {
            const isSelected = selectedIds.has(project.id);
            const isExpanded = expandedId === project.id;

            return (
              <React.Fragment key={project.id}>
                <TooltipFloating
                  label="Expand project details"
                  position="right"
                >
                  <Table.Tr
                    bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}
                    onClick={() => toggleRow(project.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(project.id)}
                        aria-label={`Select ${project.name}`}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{project.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                        {formatTimePeriod(project.startDate, project.endDate)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {project.tags && project.tags.length > 0 && (
                        <Group gap={6}>
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="light"
                              color="blue"
                              size="sm"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </Table.Td>
                  </Table.Tr>
                </TooltipFloating>
                <Table.Tr>
                  <Table.Td colSpan={4} p={0} style={{ borderBottom: isExpanded ? undefined : 'none' }}>
                    <Collapse expanded={isExpanded}>
                      <Box p="md" >
                        {project.description ? (
                          <MarkdownRenderer content={project.description} />
                        ) : (
                          <Text c="dimmed" fs="italic">
                            No description provided.
                          </Text>
                        )}
                      </Box>
                    </Collapse>
                  </Table.Td>
                </Table.Tr>
              </React.Fragment>
            );
          })}
          {projects.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" c="dimmed" py="xl">
                  No projects found. Create one to get started!
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
