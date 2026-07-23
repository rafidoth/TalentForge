import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, searchProjects, createProject, updateProject, deleteProject } from '~/api/profile';
import type { CreateProjectDto, UpdateProjectDto, ProjectSearchQueryDto } from '~/api/types';

export function useProjects() {
    return useQuery({
        queryKey: ['profile', 'projects'],
        queryFn: fetchProjects,
    });
}

export function useSearchProjects(dto: ProjectSearchQueryDto) {
    return useQuery({
        queryKey: ['profile', 'projects', 'search', dto],
        queryFn: () => searchProjects(dto),
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateProjectDto) => createProject(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', 'projects'] });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) => updateProject(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', 'projects'] });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', 'projects'] });
        },
    });
}
