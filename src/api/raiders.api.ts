import * as Api from '@/api/api';

import { Raider } from '@/common/types/raider';

import config from '@/../config.json';

export async function createRaider(name: string, joinTimestamp?: number): Promise<Raider> {
    return await Api.post(`${config.gxpApi.baseUrl}/raiders/`, {
        name,
        join_timestamp: joinTimestamp,
    });
}

export async function updateRaider(raider: Raider): Promise<Raider> {
    return await Api.put(`${config.gxpApi.baseUrl}/raiders/${raider.id}/`, raider);
}

export async function getRaider(id: string): Promise<Raider> {
    return await Api.get(`${config.gxpApi.baseUrl}/raiders/${id}/`);
}

export async function getRaiders(active?: boolean): Promise<Raider[]> {
    const queryParams = { active: active };
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/raiders`, queryParams);
}

export async function deleteRaider(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/raiders/${id}/`);
}

export async function recalculateExperience(raider?: Raider) {
    if (raider) {
        await Api.put(`${config.gxpApi.baseUrl}/raiders/${raider.id}/calculate_experience/`);
    } else {
        await Api.put(`${config.gxpApi.baseUrl}/raiders/calculate_experience/`);
    }
}
