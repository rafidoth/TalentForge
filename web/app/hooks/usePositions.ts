import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPositions, createPosition, deletePosition, duplicatePosition, updatePosition, getPositionById } from '~/api/positions';

export function usePositions(pageNumber: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ['positions', pageNumber, pageSize],
        queryFn: () => fetchPositions(pageNumber, pageSize),
    });
}

export function useCreatePosition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        },
    });
}

export function useDeletePosition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        },
    });
}

export function useDuplicatePosition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: duplicatePosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        },
    });
}

export function useUpdatePosition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string, dto: Parameters<typeof updatePosition>[1] }) => updatePosition(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        },
    });
}

export function usePosition(id: string) {
    return useQuery({
        queryKey: ['positions', id],
        queryFn: () => getPositionById(id),
        enabled: !!id,
    });
}
