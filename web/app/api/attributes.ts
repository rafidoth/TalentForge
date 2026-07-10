import api from "./index";
import type {
    AttributeCategoryDto,
    AttributeType,
    AttributeDto,
    CreateAttributeDto,
    UpdateAttributeDto,
    PaginatedResponse
} from "./types";

export interface TypesAndCategoriesResponse {
    categories: AttributeCategoryDto[];
    types: AttributeType[];
}

export async function fetchAttributeTypesAndCategories(): Promise<TypesAndCategoriesResponse> {
    const res = await api.get("/attributes/types-and-categories");
    return res.data;
}

export async function fetchAttributes(
    search?: string,
    page: number = 1,
    pageSize: number = 20
): Promise<PaginatedResponse<AttributeDto>> {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    if (search) params.append("prefix", search);

    const res = await api.get(`/attributes?${params.toString()}`);
    return res.data;
}

export async function createAttribute(dto: CreateAttributeDto): Promise<AttributeDto> {
    const res = await api.post("/attributes", dto);
    return res.data;
}

export async function updateAttribute(id: string, dto: UpdateAttributeDto): Promise<AttributeDto> {
    const res = await api.put(`/attributes/${id}`, dto);
    return res.data;
}

export async function deleteAttribute(id: string): Promise<void> {
    await api.delete(`/attributes/${id}`);
}
