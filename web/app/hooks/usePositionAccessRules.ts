import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPositionAccessRules, createPositionAccessRule, deletePositionAccessRule } from "~/api/position-access-rules";
import type { PositionAccessRuleDto } from "~/api/types";

export const usePositionAccessRules = (positionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["positions", positionId, "accessRules"],
    queryFn: () => getPositionAccessRules(positionId),
    enabled,
  });
};

export const useCreatePositionAccessRule = (positionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PositionAccessRuleDto) => createPositionAccessRule(positionId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions", positionId, "accessRules"] });
    },
  });
};

export const useDeletePositionAccessRule = (positionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => deletePositionAccessRule(positionId, ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions", positionId, "accessRules"] });
    },
  });
};
