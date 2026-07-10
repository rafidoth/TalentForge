import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAttributes, 
  createAttribute, 
  updateAttribute, 
  deleteAttribute,
  fetchAttributeTypesAndCategories
} from "../../api/attributes";
import { 
  fetchPositionAttributes, 
  addPositionAttribute, 
  removePositionAttribute 
} from "../../api/positions";
import type { CreateAttributeDto, UpdateAttributeDto, CreatePositionAttributeDto } from "../../api/types";

export const useAttributes = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["attributes", search],
    queryFn: ({ pageParam }) => fetchAttributes(search, pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });
};

export const useAttributeTypesAndCategories = () => {
  return useQuery({
    queryKey: ["attributeTypesAndCategories"],
    queryFn: fetchAttributeTypesAndCategories,
  });
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAttributeDto) => createAttribute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttributeDto }) => updateAttribute(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

export const usePositionAttributes = (positionId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["positionAttributes", positionId],
    queryFn: ({ pageParam }) => fetchPositionAttributes(positionId!, pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    enabled: !!positionId,
  });
};

export const useAddPositionAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ positionId, dto }: { positionId: string; dto: CreatePositionAttributeDto }) => 
      addPositionAttribute(positionId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["positionAttributes", variables.positionId] });
    },
  });
};

export const useRemovePositionAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ positionId, attributeId }: { positionId: string; attributeId: string }) => 
      removePositionAttribute(positionId, attributeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["positionAttributes", variables.positionId] });
    },
  });
};
