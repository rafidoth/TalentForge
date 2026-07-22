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
    categoryId?: number | null,
    recent: boolean = false,
    page: number = 1,
    pageSize: number = 20
): Promise<PaginatedResponse<AttributeDto>> {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    if (search) params.append("prefix", search);
    if (categoryId !== undefined && categoryId !== null) params.append("categoryId", categoryId.toString());
    if (recent) params.append("recent", "true");

    const res = await api.get(`/attributes?${params.toString()}`);
    return res.data;
}

export async function fetchAttributeById(id: string): Promise<AttributeDto> {
    const res = await api.get(`/attributes/${id}`);
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

export interface CloudinarySignatureResponse {
    signature: string;
    timestamp: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    publicId: string;
}

export async function getImageUploadSignature(
    attributeName: string
): Promise<CloudinarySignatureResponse> {
    const res = await api.get<CloudinarySignatureResponse>("/attributes/image/upload", {
        params: { attributeName },
    });
    return res.data;
}

export async function uploadToCloudinary(
    file: File,
    sig: CloudinarySignatureResponse
): Promise<{ secure_url: string; public_id: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);
    formData.append("public_id", sig.publicId);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Cloudinary upload failed");
    }

    return res.json();
}
