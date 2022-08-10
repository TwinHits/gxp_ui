import * as Api from "@/api/api";

import { ExperienceLevel } from '@/common/types/experienceLevel';

import config from '@/../config.json';

export async function createExperienceLevel(event: ExperienceLevel): Promise<ExperienceLevel> {
    return await Api.post(`${config.gxpApi.baseUrl}/experienceLevels/`, event) as ExperienceLevel;
}

export async function getExperienceLevel(id: string): Promise<ExperienceLevel> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceLevels/${id}`) as ExperienceLevel;
}

export async function getExperienceLevels(): Promise<ExperienceLevel[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceLevels/`) as ExperienceLevel[];
}

export async function deleteExperienceLevel(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceLevels/${id}`);
}