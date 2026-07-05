import api from "./index";
import type { AttributeCategoryDto, AttributeType } from "./types";

export interface TypesAndCategoriesResponse {
    categories: AttributeCategoryDto[];
    types: AttributeType[];
}

export async function fetchAttributeTypesAndCategories(): Promise<TypesAndCategoriesResponse> {
    const res = await api.get("/attribute/types-and-categories");
    return res.data;
}
