import * as Api from "@/api/api";

import config from '@/../config.json';

import { ExperienceEvent } from '@/common/types/experienceEvent';

export async function createExperienceEvent(event: ExperienceEvent): Promise<ExperienceEvent> {
    return await Api.post(`${config.gxpApi.baseUrl}/experienceEvents/`, event) as ExperienceEvent;
}

export async function getExperienceEvent(id: string): Promise<ExperienceEvent> {
    return await Api.get(`${config.gxpApi.baseUrl}/experienceEvents/${id}`) as ExperienceEvent;
}

export async function getExperienceEvents(): Promise<ExperienceEvent[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/experienceEvents/`) as ExperienceEvent[];
}

export async function updateExperienceEvent(event: ExperienceEvent) {
    return await Api.put(`${config.gxpApi.baseUrl}/experienceEvents/${event.id}/`, event) as Promise<ExperienceEvent>;
}

export async function deleteExpereiceEvent(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/experienceEvents/${id}`);
}