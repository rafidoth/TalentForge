import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfileAttributes,
  addProfileAttribute,
  updateProfileAttribute,
  deleteProfileAttribute,
} from "../../api/profile";

export const useProfileAttributes = () => {
  return useQuery({
    queryKey: ["profileAttributes"],
    queryFn: fetchProfileAttributes,
  });
};

export const useAddProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProfileAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};

export const useUpdateProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => updateProfileAttribute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};

export const useDeleteProfileAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileAttributes"] });
    },
  });
};
