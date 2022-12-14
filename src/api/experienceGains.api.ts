import * as Api from '@/api/api';

import { ExperienceGain } from '@/common/types/experienceGain';

import config from '@/../config.json';

export async function createExperienceGain(gain: ExperienceGain): Promise<ExperienceGain> {
    return await Api.post(`${config.gxpApi.baseUrl}/experienceGains/`, gain);
}

export async function getExperienceGain(id: string): Promise<ExperienceGain> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceGains/${id}`);
}

export async function getExperienceGains(): Promise<ExperienceGain[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceGains/`);
}

export async function getExperienceGainsForRaiderId(raiderId: string): Promise<ExperienceGain[]> {
    const queryParams = {
        raiderId,
    };
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceGains/`, queryParams);
}

export async function deleteExperienceGain(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceGains/${id}/`);
}
