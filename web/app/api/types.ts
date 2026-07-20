export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
};

export type AuthInfo = {
  userId: string;
  email: string;
  role: string;
};

// Profile DTOs

export interface ProfileAttributeDto {
  id: string;
  attributeId: string;
  attributeName: string;
  typeName: string;
  categoryName: string;
  isBuiltin?: boolean;
  value: any;
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

export interface UpdateProfileAttributeValueDto {
  profileAttributeId: string;
  value: string;
  version: number;
}

export interface UpdateMeSectionDto {
  attributes: UpdateProfileAttributeValueDto[];
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

export interface AttributeDto {
  id: string;
  name: string;
  description?: string;
  typeId: number;
  typeName: string;
  categoryId: number;
  categoryName: string;
  isBuiltin: boolean;
  dropdownOptions: DropdownOptionDto[] | null;
  version: number;
}

export interface CreateAttributeDto {
  name: string;
  typeId: number;
  categoryId: number;
  value?: string;
  description?: string;
  dropdownOptions?: string[] | null;
}

export interface UpdateAttributeDto {
  name?: string;
  typeId?: number;
  categoryId?: number;
  dropdownOptions?: string[] | null;
  version: number;
}

export interface PositionAttributeDto {
  id: string;
  attribute: AttributeDto;
  order: number;
}

export interface CreatePositionAttributeDto {
  attributeId: string;
}

export interface AddProfileAttributeDto {
  attributeId: string;
  value: any;
}

// Project DTOs
export interface ProjectDto {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  tags: TagDto[];
  version: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProjectDto {
  name: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  tags: string[];
}

export interface UpdateProjectDto {
  name?: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  tags?: string[];
  version: number;
}

export interface TagDto {
  id: string;
  name: string;
}

export interface CreatePositionTagDto {
  tagIds: string[];
}

export enum RuleOperator {
  Equals = 0,
  NotEquals = 1,
  GreaterThan = 2,
  GreaterThanOrEqual = 3,
  LessThan = 4,
  LessThanOrEqual = 5,
  Contains = 6,
}

export interface PositionAccessRuleDto {
  id?: string;
  attributeId: string;
  attributeName?: string;
  attributeTypeName?: string;
  operator: RuleOperator;
  expectedValue: string;
}

export interface CandidatePositionAttributesDto {
  filledAttributes: ProfileAttributeDto[];
  missingAttributes: AttributeDto[];
}
