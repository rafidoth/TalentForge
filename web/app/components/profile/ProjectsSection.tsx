import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Center,
  Loader,
  ThemeIcon,
  Title,
  Divider,
  Button,
} from "@mantine/core";
import { FolderIcon, GearIcon } from "@phosphor-icons/react";
import { useProjects } from "~/hooks/useProjects";
import type { ProjectDto } from "~/api/types";
import { formatTimePeriod } from "./profileUtils";
import { useNavigate } from "react-router";

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const navigate = useNavigate();

  return (
    <Paper withBorder={false} shadow="none">
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
            <FolderIcon size={20} />
          </ThemeIcon>
          <Title order={3} fw={600}>
            Projects
          </Title>
        </Group>
        <Button
          variant="light"
          color="myColor"
          leftSection={<GearIcon size={18} />}
          onClick={() => navigate("/app/c/projects")}
        >
          Manage
        </Button>
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
    </Paper>
  );
}
