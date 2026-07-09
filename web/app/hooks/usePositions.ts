import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPositions, createPosition, deletePosition, duplicatePosition } from '~/api/positions';

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
