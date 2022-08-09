import * as Api from "@/api/api";

import config from '@/../config.json';

import { ExperienceEvent } from '@/common/types/experienceEvent';


export async function getExperienceEvent(id: string): Promise<ExperienceEvent> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceEvents/${id}`) as ExperienceEvent;
}

export async function getExperienceEvents(): Promise<ExperienceEvent[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceEvents/`) as ExperienceEvent[];
}

export async function deleteExpereiceEvent(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceEvents/${id}`);
}