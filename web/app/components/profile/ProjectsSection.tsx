import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Center,
  Loader,
  ThemeIcon,
  Title,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { PlusIcon, FolderIcon } from "@phosphor-icons/react";
import { useProjects } from "~/hooks/useProjects";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import type { ProjectDto } from "~/api/types";
import { formatTimePeriod } from "./profileUtils";

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const [projectModalOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);

  const [projectDetailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(
    null,
  );

  const handleProjectClick = (project: ProjectDto) => {
    setSelectedProject(project);
    openDetails();
  };

  const handleEditClick = (project: ProjectDto) => {
    closeDetails();
    openForm();
  };

  const handleAddClick = () => {
    setSelectedProject(null);
    openForm();
  };

  return (
    <Paper p="xl" withBorder={false} shadow="none">
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
            <FolderIcon size={20} />
          </ThemeIcon>
          <Title order={3} fw={600}>
            Projects
          </Title>
        </Group>
        <ActionIcon
          variant="outline"
          color="myColor"
          radius="xl"
          size="lg"
          onClick={handleAddClick}
          aria-label="Add project"
        >
          <PlusIcon size={18} />
        </ActionIcon>
      </Group>
      <Divider mb="md" />

      {isLoading ? (
        <Center p="xl">
          <Loader />
        </Center>
      ) : !projects || projects.length === 0 ? (
        <Center p="xl">
          <Text c="dimmed" size="sm">
            No projects yet. Add your first project!
          </Text>
        </Center>
      ) : (
        <Stack gap="sm">
          {projects.map((project: ProjectDto) => (
            <Paper
              key={project.id}
              withBorder
              p="md"
              radius="md"
              style={{ cursor: "pointer" }}
              onClick={() => handleProjectClick(project)}
            >
              <Group justify="space-between" align="flex-start">
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text fw={600} size="md">
                    {project.name}
                  </Text>
                  {project.tags && project.tags.length > 0 && (
                    <Group gap={6}>
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="light"
                          color="myColor"
                          size="sm"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Stack>
                <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                  {formatTimePeriod(project.startDate, project.endDate)}
                </Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      <ProjectFormModal
        opened={projectModalOpened}
        onClose={closeForm}
        project={selectedProject}
      />

      <ProjectDetailsModal
        opened={projectDetailsOpened}
        onClose={closeDetails}
        project={selectedProject}
        onEdit={handleEditClick}
      />
    </Paper>
  );
}
