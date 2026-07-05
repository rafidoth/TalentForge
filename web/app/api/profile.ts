import api from "./index";
import type { MeSectionDto, ServiceResult } from "./types";

export async function fetchMeSection(): Promise<MeSectionDto> {
    const res = await api.get<ServiceResult<MeSectionDto>>("/profile/me");
    if (!res.data.isSuccess || !res.data.data) {
        throw new Error(res.data.message ?? "Failed to fetch profile");
    }
    return res.data.data;
}
