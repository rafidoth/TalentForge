import api from "./index";
import type { MeSectionDto, UpdateMeSectionDto, ProfileAttributeDto, AddProfileAttributeDto, UpdateProfileAttributeValueDto, ProjectDto, CreateProjectDto, UpdateProjectDto, TagDto } from "./types";

export async function fetchMeSection(): Promise<MeSectionDto> {
    const res = await api.get<MeSectionDto>("/profile/me");
    return res.data;
}

export async function updateMeSection(dto: UpdateMeSectionDto): Promise<void> {
    await api.put("/profile/me", dto);
}

export async function fetchProfileAttributes(): Promise<ProfileAttributeDto[]> {
    const res = await api.get<ProfileAttributeDto[]>("/profile/attributes/non-built-in");
    return res.data;
}

export async function addProfileAttribute(dto: AddProfileAttributeDto): Promise<void> {
    await api.post("/profile/attributes", dto);
}

export async function updateProfileAttribute(dto: UpdateProfileAttributeValueDto): Promise<void> {
    await api.put("/profile/attributes", dto);
}

export async function deleteProfileAttribute(profileAttributeId: string): Promise<void> {
    await api.delete(`/profile/attributes/${profileAttributeId}`);
}

export async function fetchProjects(): Promise<ProjectDto[]> {
    const res = await api.get<ProjectDto[]>("/profile/projects");
    return res.data;
}

export async function createProject(dto: CreateProjectDto): Promise<ProjectDto> {
    const res = await api.post<ProjectDto>("/profile/projects", dto);
    return res.data;
}

export async function updateProject(id: string, dto: UpdateProjectDto): Promise<ProjectDto> {
    const res = await api.put<ProjectDto>(`/profile/projects/${id}`, dto);
    return res.data;
}

export async function deleteProject(id: string): Promise<void> {
    await api.delete(`/profile/projects/${id}`);
}

export async function searchTags(prefix: string, n: number = 10): Promise<TagDto[]> {
    const res = await api.get<TagDto[]>("/tags", { params: { prefix, n } });
    return res.data;
}
