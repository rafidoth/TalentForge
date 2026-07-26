import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  fetchAttributeTypesAndCategories,
  fetchAttributeById,
} from "../../api/attributes";
import {
  fetchPositionAttributes,
  addPositionAttribute,
  removePositionAttribute,
} from "../../api/positions";

import type {
  CreateAttributeDto,
  UpdateAttributeDto,
  CreatePositionAttributeDto,
  DeletePositionAttributeDto,
  AttributeDto,
} from "../../api/types";

export const useAttributes = (
  search: string = "",
  categoryId: number | null = null,
  recent: boolean = false,
  pageNumber: number = 1,
  pageSize: number = 20
) => {
  return useQuery({
    queryKey: ["attributes", search, categoryId, recent, pageNumber, pageSize],
    queryFn: () => fetchAttributes(search, categoryId, recent, pageNumber, pageSize),
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

export const useUpdateAttribute = (conflictHandler: (latestData: AttributeDto) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttributeDto }) =>
      updateAttribute(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: async (error: any, variables) => {
      const { id } = variables;
      if (error.response && error.response.status === 409) {
        const latest: AttributeDto = await queryClient.fetchQuery({
          queryKey: ["attribute", id],
          queryFn: () => fetchAttributeById(id),
        });
        conflictHandler(latest);
        queryClient.invalidateQueries({ queryKey: ["attributes"] });
      }
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
    queryFn: ({ pageParam }) =>
      fetchPositionAttributes(positionId!, pageParam as number, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    enabled: !!positionId,
  });
};

export const useAddPositionAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      positionId,
      dto,
    }: {
      positionId: string;
      dto: CreatePositionAttributeDto | { attributeIds: string[] } | { attributeId: string } | string[];
    }) => addPositionAttribute(positionId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positionAttributes", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", "attributes", "position", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["position", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cv"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fullCv"],
      });
    },
  });
};

export const useRemovePositionAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      positionId,
      attributeId,
      attributeIds,
      dto,
    }: {
      positionId: string;
      attributeId?: string;
      attributeIds?: string[];
      dto?: DeletePositionAttributeDto | { attributeIds: string[] } | { attributeId: string } | string | string[];
    }) => {
      const payload = dto || attributeIds || (attributeId ? [attributeId] : []);
      return removePositionAttribute(positionId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positionAttributes", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", "attributes", "position", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["position", variables.positionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cv"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fullCv"],
      });
    },
  });
};

