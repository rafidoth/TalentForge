import api from "./index";
import type { PaginatedResponse } from "./types";

export interface CreateCvDto {
    positionId: string;
}

export interface MissingAttributeDto {
    attributeId: string;
    name: string;
}

export interface CreateCvResponseDto {
    cvId: string;
    missingAttributes: MissingAttributeDto[];
}

export async function createCv(dto: CreateCvDto): Promise<CreateCvResponseDto> {
    const res = await api.post<CreateCvResponseDto>("/cvs", dto);
    return res.data;
}

export interface CheckCvExistsResponseDto {
    exists: boolean;
    cvId: string | null;
}

export async function checkCvExists(positionId: string): Promise<CheckCvExistsResponseDto> {
    const res = await api.get<CheckCvExistsResponseDto>(`/cvs/exists/${positionId}`);
    return res.data;
}

export interface UpdateCvDto {
    chosenProjectIds: string[];
    isPublished: boolean;
}

export async function updateCv(id: string, dto: UpdateCvDto): Promise<void> {
    await api.put(`/cvs/${id}`, dto);
}

export async function getCvById(id: string): Promise<any> {
    const res = await api.get(`/cvs/${id}`);
    return res.data;
}

export interface CvListDto {
    id: string;
    candidateId: string;
    positionId: string;
    positionTitle: string;
    candidateName: string;
    isPublished: boolean;
    createdAt: string;
    likeCount: number;
}

export async function getCandidateCvs(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CvListDto>> {
    const res = await api.get<PaginatedResponse<CvListDto>>(`/cvs/candidate?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
}
