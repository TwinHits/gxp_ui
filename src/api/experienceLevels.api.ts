import * as Api from '@/api/api';

import { ExperienceLevel } from '@/common/types/experienceLevel';

import config from '@/../config.json';

export async function createExperienceLevel(level: ExperienceLevel): Promise<ExperienceLevel> {
    return await Api.post(`${config.gxpApi.baseUrl}/experienceLevels/`, level);
}

export async function updateExperienceLevel(level: ExperienceLevel): Promise<ExperienceLevel> {
    return await Api.put(`${config.gxpApi.baseUrl}/experienceLevels/${level.id}/`, level);
}

export async function getExperienceLevel(id: string): Promise<ExperienceLevel> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceLevels/${id}`);
}

export async function getExperienceLevels(): Promise<ExperienceLevel[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceLevels/`);
}

export async function deleteExperienceLevel(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceLevels/${id}`);
}
