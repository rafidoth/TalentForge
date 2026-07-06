import api from "./index";
import type { PaginatedResponse, UserListDto } from "./types";

export async function getUsers(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<UserListDto>> {
    const res = await api.get(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
}

export async function blockUsers(userIds: string[]): Promise<void> {
    await api.post('/users/block', { userIds });
}

export async function unblockUsers(userIds: string[]): Promise<void> {
    await api.post('/users/unblock', { userIds });
}

export async function deleteUsers(userIds: string[]): Promise<void> {
    await api.delete('/users', { data: { userIds } });
}

export async function assignRoleToUsers(userIds: string[], roleName: string): Promise<void> {
    await api.post('/users/assign-role', { userIds, roleName });
}
