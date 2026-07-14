import api from "./index";
import type { MeSectionDto, UpdateMeSectionDto } from "./types";

export async function fetchMeSection(): Promise<MeSectionDto> {
    const res = await api.get<MeSectionDto>("/profile/me");
    return res.data;
}

export async function updateMeSection(dto: UpdateMeSectionDto): Promise<MeSectionDto> {
    const res = await api.put<MeSectionDto>("/profile/me", dto);
    return res.data;
}
