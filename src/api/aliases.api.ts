import * as Api from '@/api/api';

import { Alias } from '@/common/types/alias';

import config from '@/../config.json';

export async function createAlias(name: string, raiderId: string): Promise<Alias> {
    return await Api.post(`${config.gxpApi.baseUrl}/aliases/`, {
        name,
        raider: raiderId,
    });
}

export async function getAlias(id: string): Promise<Alias> {
    return await Api.get(`${config.gxpApi.baseUrl}/aliases/${id}`);
}

export async function getAliases(): Promise<Alias[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/aliases/`);
}

export async function deleteAlias(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/aliases/${id}`);
}
