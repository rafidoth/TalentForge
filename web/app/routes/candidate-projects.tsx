import { useState } from "react";
import type { RouteHandle } from "~/auth/types";
import {
    Container,
    Stack,
    Group,
    Text,
    Loader,
    Center,
    Title,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useProjects, useDeleteProject } from "~/hooks/useProjects";
import { ProjectTable } from "~/components/projects/ProjectTable";
import { ProjectFormModal } from "~/components/projects/ProjectFormModal";
import { PencilSimpleIcon, TrashIcon, PlusIcon } from "@phosphor-icons/react";
import type { ProjectDto } from "~/api/types";

export const handle: RouteHandle = {
    allowedRoles: ["Candidate"]
};

export default function CandidateProjectsPage() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    const { data: projects, isLoading, isError } = useProjects();
    const deleteMutation = useDeleteProject();

    const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ProjectDto | null>(null);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedIds.size} project(s)?`)) {
            setIsDeletingBulk(true);
            try {
                const promises = Array.from(selectedIds).map(id =>
                    deleteMutation.mutateAsync(id)
                );
                await Promise.all(promises);
                setSelectedIds(new Set());
            } catch (error) {
                console.error("Failed to delete some projects.", error);
            } finally {
                setIsDeletingBulk(false);
            }
        }
    };

    const handleEdit = () => {
        if (selectedIds.size !== 1 || !projects) return;
        const selectedId = Array.from(selectedIds)[0];
        const project = projects.find(p => p.id === selectedId);
        if (project) {
            setSelectedProjectForEdit(project);
            openForm();
        }
    };

    const handleCreate = () => {
        setSelectedProjectForEdit(null);
        openForm();
    };

    const handleFormClose = () => {
        closeForm();
        setSelectedProjectForEdit(null);
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="md">
                <Group justify="space-between">
                    <Title size="h1">My Projects</Title>
                </Group>

                <Group align="flex-end" justify="flex-end">
                    <Group gap="xs" align="center" ml="auto">
                        <Tooltip label="New Project" withArrow>
                            <ActionIcon variant="light" size="lg" color="gray" onClick={handleCreate}>
                                <PlusIcon size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Edit Project" withArrow>
                            <ActionIcon
                                variant="light"
                                size="lg"
                                color="blue"
                                disabled={selectedIds.size !== 1}
                                onClick={handleEdit}
                            >
                                <PencilSimpleIcon size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Delete Project" withArrow>
                            <ActionIcon
                                variant="light"
                                size="lg"
                                color="red"
                                disabled={selectedIds.size === 0}
                                onClick={handleBulkDelete}
                                loading={isDeletingBulk}
                            >
                                <TrashIcon size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                {isLoading ? (
                    <Center p="xl" mih={300}>
                        <Loader variant="bars" color="blue" />
                    </Center>
                ) : isError ? (
                    <Center p="xl" mih={300}>
                        <Text c="red">Failed to load projects.</Text>
                    </Center>
                ) : (
                    <Stack gap="xl">
                        <ProjectTable
                            projects={projects || []}
                            selectedIds={selectedIds}
                            onToggleSelect={handleToggleSelect}
                        />
                    </Stack>
                )}
            </Stack>

            <ProjectFormModal
                opened={formOpened}
                onClose={handleFormClose}
                project={selectedProjectForEdit}
            />
        </Container>
    );
}
