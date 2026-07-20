import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMeSection, updateMeSection, fetchCandidatePositionAttributes, addProfileAttribute, updateProfileAttribute } from '~/api/profile';
import type { UpdateMeSectionDto, AddProfileAttributeDto, UpdateProfileAttributeValueDto } from '~/api/types';

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

export function useCandidatePositionAttributes(positionId: string | undefined) {
    return useQuery({
        queryKey: ['profile', 'attributes', 'position', positionId],
        queryFn: () => fetchCandidatePositionAttributes(positionId!),
        enabled: !!positionId,
    });
}

export function useAddProfileAttribute() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddProfileAttributeDto) => addProfileAttribute(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile', 'attributes'] });
            await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
}

export function useUpdateProfileAttribute() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileAttributeValueDto) => updateProfileAttribute(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile', 'attributes'] });
            await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
}
