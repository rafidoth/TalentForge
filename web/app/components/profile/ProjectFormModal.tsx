import { Modal, TextInput, Textarea, Select, MultiSelect, Button, Group, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { useCreateProject, useUpdateProject } from '~/hooks/useProjects';
import { searchTags } from '~/api/profile';
import type { TagDto, ProjectDto } from '~/api/types';
import { MarkdownEditor } from '~/components/common/MarkdownEditor';

const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear + 2; y >= 2000; y--) {
        years.push({ value: y.toString(), label: y.toString() });
    }
    return years;
}

const YEARS = generateYearOptions();

function getDefaultStartDateValues() {
    const now = new Date();
    return {
        startMonth: String(now.getMonth() + 1).padStart(2, '0'),
        startYear: String(now.getFullYear()),
    };
}

interface ProjectFormModalProps {
    opened: boolean;
    onClose: () => void;
    project?: ProjectDto | null;
}

export function ProjectFormModal({ opened, onClose, project }: ProjectFormModalProps) {
    const { mutate: createProject, isPending: isCreating } = useCreateProject();
    const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
    const isPending = isCreating || isUpdating;
    const [tagSearch, setTagSearch] = useState('');
    const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    const form = useForm({
        initialValues: {
            name: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            description: '',
        },
        validate: {
            name: (v) => (v.trim().length > 0 ? null : 'Project name is required'),
        },
    });

    useEffect(() => {
        if (opened) {
            if (project) {
                const start = project.startDate ? new Date(project.startDate) : null;
                const end = project.endDate ? new Date(project.endDate) : null;
                form.setValues({
                    name: project.name,
                    startMonth: start ? String(start.getMonth() + 1).padStart(2, '0') : '',
                    startYear: start ? String(start.getFullYear()) : '',
                    endMonth: end ? String(end.getMonth() + 1).padStart(2, '0') : '',
                    endYear: end ? String(end.getFullYear()) : '',
                    description: project.description || '',
                });

                const currentTagIds = project.tags.map(t => t.id);
                setSelectedTagIds(currentTagIds);
                setTagOptions(project.tags.map(t => ({ value: t.id, label: t.name })));
            } else {
                form.setValues({
                    name: '',
                    ...getDefaultStartDateValues(),
                    endMonth: '',
                    endYear: '',
                    description: '',
                });
                setSelectedTagIds([]);
                setTagOptions([]);
            }
        }
    }, [opened, project]);

    useEffect(() => {
        if (tagSearch.length === 0) return;
        const timeout = setTimeout(async () => {
            try {
                const results = await searchTags(tagSearch);
                setTagOptions((prev) => {
                    const existing = prev.filter((o) => selectedTagIds.includes(o.value));
                    const newOpts = results
                        .filter((t: TagDto) => !existing.some((e) => e.value === t.id))
                        .map((t: TagDto) => ({ value: t.id, label: t.name }));
                    return [...existing, ...newOpts];
                });
            } catch { /* ignore */ }
        }, 300);
        return () => clearTimeout(timeout);
    }, [tagSearch, selectedTagIds]);

    const buildDateOnly = (month: string, year: string): string | null => {
        if (!month || !year) return null;
        return `${year}-${month}-01`;
    };

    const handleSubmit = (values: typeof form.values) => {
        const payload = {
            name: values.name,
            startDate: buildDateOnly(values.startMonth, values.startYear),
            endDate: buildDateOnly(values.endMonth, values.endYear),
            description: values.description || null,
            tags: selectedTagIds,
        };

        if (project) {
            updateProject(
                { id: project.id, dto: { ...payload, version: project.version } },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                }
            );
        } else {
            createProject(
                payload,
                {
                    onSuccess: () => {
                        handleClose();
                    },
                }
            );
        }
    };

    const handleClose = () => {
        form.reset();
        setSelectedTagIds([]);
        setTagOptions([]);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={handleClose} centered size="70%" title={<Title order={3}>{project ? 'Edit Project' : 'New Project'}</Title>}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md" p="md">
                    <TextInput
                        withAsterisk
                        label="Project Name"
                        placeholder="e.g. E-Commerce Platform"
                        {...form.getInputProps('name')}
                    />

                    <Group >
                        <Select
                            label="Start Month"
                            placeholder="Month"
                            data={MONTHS}
                            clearable
                            {...form.getInputProps('startMonth')}

                        />
                        <Select
                            label="Start Year"
                            placeholder="Year"
                            data={YEARS}
                            clearable
                            searchable
                            {...form.getInputProps('startYear')}
                        />
                    </Group>

                    <Group >
                        <Select
                            label="End Month"
                            placeholder="Month"
                            data={MONTHS}
                            clearable
                            {...form.getInputProps('endMonth')}
                        />
                        <Select
                            label="End Year"
                            placeholder="Year"
                            data={YEARS}
                            clearable
                            searchable
                            {...form.getInputProps('endYear')}
                        />
                    </Group>

                    <MarkdownEditor
                        label="Description"
                        description="Brief description of the project"
                        {...form.getInputProps('description')}
                    />

                    <MultiSelect
                        label="Tags"
                        placeholder="Search and select tags"
                        data={tagOptions}
                        value={selectedTagIds}
                        onChange={setSelectedTagIds}
                        searchable
                        onSearchChange={setTagSearch}
                        nothingFoundMessage={tagSearch.length > 0 ? 'No tags found' : 'Type to search tags'}
                        clearable
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" loading={isPending}>{project ? 'Save Changes' : 'Create Project'}</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
