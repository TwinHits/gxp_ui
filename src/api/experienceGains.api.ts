import * as Api from "@/api/api";

import { ExperienceGain } from '@/common/types/experienceGain';

import config from '@/../config.json';

export async function getExperienceGain(id: string): Promise<ExperienceGain> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceGains/${id}`) as ExperienceGain;
}

export async function getExperienceGains(): Promise<ExperienceGain[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceGains/`) as ExperienceGain[];
}

export async function deleteExperienceGain(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceGains/${id}`);
}