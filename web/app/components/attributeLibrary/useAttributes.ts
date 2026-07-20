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
import {
  fetchProfileAttributes,
  addProfileAttribute,
  updateProfileAttribute,
  deleteProfileAttribute,
} from "../../api/profile";
import type {
  CreateAttributeDto,
  UpdateAttributeDto,
  CreatePositionAttributeDto,
  AddProfileAttributeDto,
  UpdateProfileAttributeValueDto,
  AttributeDto,
} from "../../api/types";

export const useAttributes = (search: string = "", pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["attributes", search, pageNumber, pageSize],
    queryFn: () => fetchAttributes(search, pageNumber, pageSize),
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
      fetchPositionAttributes(positionId!, pageParam as number, 10),
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
      dto: CreatePositionAttributeDto;
    }) => addPositionAttribute(positionId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positionAttributes", variables.positionId],
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
    }: {
      positionId: string;
      attributeId: string;
    }) => removePositionAttribute(positionId, attributeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["positionAttributes", variables.positionId],
      });
    },
  });
};

export const useProfileAttributes = () => {
  return useQuery({
    queryKey: ["profileAttributes"],
    queryFn: () => fetchProfileAttributes(),
  });
};

export const useAddProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddProfileAttributeDto) => addProfileAttribute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};

export const useUpdateProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileAttributeValueDto) => updateProfileAttribute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};

export const useDeleteProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileAttributeId: string) =>
      deleteProfileAttribute(profileAttributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};
