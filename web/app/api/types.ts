export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    location: string;
}

export type AuthInfo = {
    userId: string;
    email: string;
    role: string;
}

// Profile DTOs

export interface ProfileAttributeDto {
    id: string;
    attributeId: string;
    attributeName: string;
    typeName: string;
    categoryName: string;
    value: string;
    dropdownOptions: DropdownOptionDto[] | null;
    version: number;
}

export interface DropdownOptionDto {
    id: string;
    label: string;
}

export interface MeSectionDto {
    meAttributes: ProfileAttributeDto[];
}

export interface ServiceResult<T> {
    isSuccess: boolean;
    message: string | null;
    data: T | null;
    errorCode: string | null;
}

export interface AttributeCategoryDto {
    id: number;
    name: string;
}

export interface AttributeType {
    id: number;
    name: string;
}

export interface UserListDto {
    id: string;
    email: string;
    method: string;
    status: string;
    role: string;
    joinedAt: string;
    lastLoginAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}