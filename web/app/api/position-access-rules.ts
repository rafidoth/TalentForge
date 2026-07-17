import api from "./index";
import type { PositionAccessRuleDto } from "./types";

export const getPositionAccessRules = async (positionId: string) => {
  const { data } = await api.get<PositionAccessRuleDto[]>(`/positions/${positionId}/access-rules`);
  return data;
};

export const createPositionAccessRule = async (positionId: string, dto: PositionAccessRuleDto) => {
  const { data } = await api.post<PositionAccessRuleDto>(`/positions/${positionId}/access-rules`, dto);
  return data;
};

export const updatePositionAccessRule = async (positionId: string, ruleId: string, dto: PositionAccessRuleDto) => {
  const { data } = await api.put<PositionAccessRuleDto>(`/positions/${positionId}/access-rules/${ruleId}`, dto);
  return data;
};

export const deletePositionAccessRule = async (positionId: string, ruleId: string) => {
  await api.delete(`/positions/${positionId}/access-rules/${ruleId}`);
};
