import api from "./index";
import type { PaginatedResponse } from "./types";

export interface PositionDto {
  id: string;
  title: string;
  shortDescription?: string;
  isPublic: boolean;
  maxProjects: number;
  createdAt: string;
  attributes: any[];
  accessRules: any[];
  technologyTags: any[];
}


export interface CreatePositionDto {
  title: string;
}

export interface UpdatePositionDto {
  title: string;
  shortDescription?: string;
  isPublic: boolean;
  maxProjects: number;
  attributes: any[];
  accessRules: any[];
  technologyTags: any[];
}



export const fetchPositions = async (
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<PositionDto>> => {
  const fetchPositionsUrl = `/positions?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const { data } = await api.get<PaginatedResponse<PositionDto>>(fetchPositionsUrl)
  return data;
};

export const createPosition = async (dto: CreatePositionDto) => {
  const { data } = await api.post<PositionDto>("/api/positions", dto);
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
