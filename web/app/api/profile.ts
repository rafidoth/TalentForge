import api from "./index";
import type { MeSectionDto, UpdateMeSectionDto, ProfileAttributeDto, AddProfileAttributeDto, UpdateProfileAttributeValueDto } from "./types";

export async function fetchMeSection(): Promise<MeSectionDto> {
    const res = await api.get<MeSectionDto>("/profile/me");
    return res.data;
}

export async function updateMeSection(dto: UpdateMeSectionDto): Promise<MeSectionDto> {
    const res = await api.put<MeSectionDto>("/profile/me", dto);
    return res.data;
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
