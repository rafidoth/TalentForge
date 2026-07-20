import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCv, checkCvExists, updateCv, getCvById, getCandidateCvs } from '~/api/cvs';
import type { CreateCvDto, UpdateCvDto } from '~/api/cvs';

export function useCreateCv() {
    return useMutation({
        mutationFn: (data: CreateCvDto) => createCv(data),
    });
}

export function useCheckCvExists(positionId: string | undefined) {
    return useQuery({
        queryKey: ['cvs', 'exists', positionId],
        queryFn: () => checkCvExists(positionId!),
        enabled: !!positionId,
    });
}

export function useUpdateCv() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string, dto: UpdateCvDto }) => updateCv(id, dto),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['cvs', id] });
        },
    });
}

export function useCv(cvId: string | undefined) {
    return useQuery({
        queryKey: ['cvs', cvId],
        queryFn: () => getCvById(cvId!),
        enabled: !!cvId,
    });
}

export function useCandidateCvs(pageNumber: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ['candidateCvs', pageNumber, pageSize],
        queryFn: () => getCandidateCvs(pageNumber, pageSize),
    });
}
