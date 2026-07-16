import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMeSection, updateMeSection } from '~/api/profile';
import type { UpdateMeSectionDto } from '~/api/types';

export function useMeSection() {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: fetchMeSection,
    });
}

export function useUpdateMeSection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateMeSectionDto) => updateMeSection(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
}
