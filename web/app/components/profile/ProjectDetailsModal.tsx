import { Modal, Title, Text, Group, Badge, Stack, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TrashIcon } from '@phosphor-icons/react';
import type { ProjectDto } from '~/api/types';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';
import { useDeleteProject } from '~/hooks/useProjects';
import { formatTimePeriod } from './profileUtils';

interface ProjectDetailsModalProps {
    opened: boolean;
    onClose: () => void;
    project: ProjectDto | null;
    onEdit: (project: ProjectDto) => void;
}

export function ProjectDetailsModal({ opened, onClose, project, onEdit }: ProjectDetailsModalProps) {
    const { mutate: deleteProject, isPending } = useDeleteProject();
    const [confirmationOpened, { open, close }] = useDisclosure(false);
    if (!project) return null;

    const handleDelete = () => {
        open();
    };

    const handleConfirmDelete = () => {
        deleteProject(project.id, {
            onSuccess: () => {
                close();
                onClose();
            }
        });
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={onClose}
                centered size="xl" >
                <Stack gap="md" p="md">
                    <Group justify='space-between'>
                        <Stack>
                            <Title >{project.name}</Title>
                            <Text c="dimmed" fw={500}>
                                {formatTimePeriod(project.startDate, project.endDate)}
                            </Text>
                        </Stack>
                        <Group justify="flex-end" mt="xl">
                            <Button
                                variant="light"
                                onClick={() => onEdit(project)}
                            >
                                Edit
                            </Button>
                            <Button
                                color="red"
                                variant="light"
                                leftSection={<TrashIcon size={16} />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Group>

                    </Group>
                    {project.tags && project.tags.length > 0 && (
                        <Group gap={6}>
                            {project.tags.map((tag) => (
                                <Badge key={tag.id} variant="light" color="myColor" size="sm">
                                    {tag.name}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    {project.description ? (
                        <Stack gap="xs">
                            <Title order={3}>Description</Title>
                            <MarkdownRenderer content={project.description} />
                        </Stack>
                    ) : (
                        <Text c="dimmed" size="sm">No description provided.</Text>
                    )}

                </Stack>
            </Modal>

            <Modal
                opened={confirmationOpened}
                onClose={close}
                centered
                size="sm"
                title={<Title order={4}>Delete project?</Title>}
            >
                <Stack gap="md" p="md">
                    <Text size="sm">
                        This will permanently delete <Text component="span" fw={700}>{project.name}</Text> and its related content.
                    </Text>
                    <Text size="sm" c="dimmed">
                        This action cannot be undone. Please confirm that you want to continue.
                    </Text>

                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={close} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            leftSection={<TrashIcon size={16} />}
                            onClick={handleConfirmDelete}
                            loading={isPending}
                        >
                            Yes, delete project
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
