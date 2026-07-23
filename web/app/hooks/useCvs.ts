import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCv, checkCvExists, updateCv, getCvById, getCandidateCvs, getPositionCvs, getFullCvById, likeCv, unlikeCv } from '~/api/cvs';
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

export function useFullCv(cvId: string | undefined) {
    return useQuery({
        queryKey: ['fullCv', cvId],
        queryFn: () => getFullCvById(cvId!),
        enabled: !!cvId,
    });
}

export function useCandidateCvs(pageNumber: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ['candidateCvs', pageNumber, pageSize],
        queryFn: () => getCandidateCvs(pageNumber, pageSize),
    });
}

export function usePositionCvs(positionId: string, pageNumber: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ['positionCvs', positionId, pageNumber, pageSize],
        queryFn: () => getPositionCvs(positionId, pageNumber, pageSize),
        enabled: !!positionId,
    });
}

export function useLikeCv() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cvId: string) => likeCv(cvId),
        onSuccess: (_, cvId) => {
            queryClient.invalidateQueries({ queryKey: ['fullCv', cvId] });
            queryClient.invalidateQueries({ queryKey: ['cvs'] });
            queryClient.invalidateQueries({ queryKey: ['positionCvs'] });
        },
    });
}

export function useUnlikeCv() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cvId: string) => unlikeCv(cvId),
        onSuccess: (_, cvId) => {
            queryClient.invalidateQueries({ queryKey: ['fullCv', cvId] });
            queryClient.invalidateQueries({ queryKey: ['cvs'] });
            queryClient.invalidateQueries({ queryKey: ['positionCvs'] });
        },
    });
}
