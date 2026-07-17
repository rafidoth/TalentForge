import api from './index';
import type { TagDto } from './types';

export const getTags = async () => {
    const res = await api.get<TagDto[]>("/tags", { params: { n: 1000 } });
    return res.data;
};

export const createTag = async (name: string) => {
    const res = await api.post<TagDto>("/tags", { name });
    return res.data;
};
