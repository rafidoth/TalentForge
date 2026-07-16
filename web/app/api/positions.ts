import api from "./index";
import type { PaginatedResponse, PositionAttributeDto, CreatePositionAttributeDto } from "./types";

export interface PositionDto {
  id: string;
  title: string;
  shortDescription?: string;
  isPublic: boolean;
  maxProjects: number;
  createdAt: string;
  accessRules?: any[];
  technologyTags?: any[];
}


export interface CreatePositionDto {
  title: string;
}

export interface UpdatePositionDto {
  title?: string;
  shortDescription?: string;
  isPublic?: boolean;
  maxProjects?: number;
  attributes?: any[];
  accessRules?: any[];
  technologyTags?: any[];
}

export const updatePosition = async (id: string, dto: UpdatePositionDto) => {
  const { data } = await api.put<PositionDto>(`/positions/${id}`, dto);
  return data;
};



export const fetchPositions = async (
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<PositionDto>> => {
  const fetchPositionsUrl = `/positions?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const { data } = await api.get<PaginatedResponse<PositionDto>>(fetchPositionsUrl)
  return data;
};

export const createPosition = async (dto: CreatePositionDto) => {
  const { data } = await api.post<PositionDto>("/positions", dto);
  return data;
};

export const deletePosition = async (id: string) => {
  await api.delete(`/positions/${id}`);
};

export const duplicatePosition = async (id: string) => {
  const { data } = await api.post<PositionDto>(
    `/positions/${id}/duplicate`,
  );
  return data;
};

export const getPositionById = async (id: string) => {
  const { data } = await api.get<PositionDto>(`/positions/${id}`);
  return data;
};

export const fetchPositionAttributes = async (
  id: string,
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<PositionAttributeDto>> => {
  const { data } = await api.get<PaginatedResponse<PositionAttributeDto>>(
    `/positions/${id}/attributes?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return data;
};

export const addPositionAttribute = async (
  id: string,
  dto: CreatePositionAttributeDto
) => {
  const { data } = await api.post(`/positions/${id}/attributes`, dto);
  return data;
};

export const removePositionAttribute = async (
  positionId: string,
  attributeId: string
) => {
  await api.delete(`/positions/${positionId}/attributes/${attributeId}`);
};
